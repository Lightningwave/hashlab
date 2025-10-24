// AES-256-CBC with PKCS7 padding

use aes::Aes256;
use cbc::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use getrandom::getrandom;

type Aes256CbcEnc = cbc::Encryptor<Aes256>;
type Aes256CbcDec = cbc::Decryptor<Aes256>;

pub fn random_iv_16() -> [u8; 16] {
    let mut iv = [0u8; 16];
    getrandom(&mut iv).expect("random iv failed");
    iv
}

pub fn encrypt(plaintext: &str, key_text: &str, iv: &[u8; 16]) -> Vec<u8> {
    let mut key = [0u8; 32];
    let kb = key_text.as_bytes();
    let n = kb.len().min(32);
    key[..n].copy_from_slice(&kb[..n]);

    let cipher = Aes256CbcEnc::new(&key.into(), iv.into());
    let mut buf = plaintext.as_bytes().to_vec();
    buf.resize(buf.len() + 16, 0u8);
    let len = plaintext.as_bytes().len();
    let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
    out.to_vec()
}

// Auto-IV version: generates IV and prepends it to ciphertext
pub fn encrypt_auto_iv(plaintext: &str, key_text: &str) -> Vec<u8> {
    let iv = random_iv_16();
    let ciphertext = encrypt(plaintext, key_text, &iv);
    
    // Prepend IV to ciphertext: [IV][CIPHERTEXT]
    let mut result = Vec::with_capacity(16 + ciphertext.len());
    result.extend_from_slice(&iv);
    result.extend_from_slice(&ciphertext);
    result
}

pub fn decrypt(ciphertext: &[u8], key_text: &str, iv: &[u8; 16]) -> Result<String, String> {
    let mut key = [0u8; 32];
    let kb = key_text.as_bytes();
    let n = kb.len().min(32);
    key[..n].copy_from_slice(&kb[..n]);

    let cipher = Aes256CbcDec::new(&key.into(), iv.into());
    let mut buf = ciphertext.to_vec();
    match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
        Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
        Err(_) => Err("decrypt error".to_string()),
    }
}

// Auto-IV version: extracts IV from beginning of ciphertext
pub fn decrypt_auto_iv(combined: &[u8], key_text: &str) -> Result<String, String> {
    if combined.len() < 16 {
        return Err("ciphertext too short".to_string());
    }
    
    // Extract IV (first 16 bytes) and ciphertext (rest)
    let iv = &combined[0..16];
    let ciphertext = &combined[16..];
    
    // Convert IV slice to array
    let mut iv_arr = [0u8; 16];
    iv_arr.copy_from_slice(iv);
    
    decrypt(ciphertext, key_text, &iv_arr)
}

// Helper function that encrypts with binary key
fn encrypt_with_key_bytes(plaintext: &str, key: &[u8; 32], iv: &[u8; 16]) -> Vec<u8> {
    let cipher = Aes256CbcEnc::new(key.into(), iv.into());
    let mut buf = plaintext.as_bytes().to_vec();
    buf.resize(buf.len() + 16, 0u8);
    let len = plaintext.as_bytes().len();
    let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
    out.to_vec()
}

// Helper function that decrypts with binary key
fn decrypt_with_key_bytes(ciphertext: &[u8], key: &[u8; 32], iv: &[u8; 16]) -> Result<String, String> {
    let cipher = Aes256CbcDec::new(key.into(), iv.into());
    let mut buf = ciphertext.to_vec();
    match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
        Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
        Err(_) => Err("decrypt error".to_string()),
    }
}

// Full auto version: takes passphrase + salt, derives key, generates IV, and prepends both salt and IV
pub fn encrypt_with_passphrase(plaintext: &str, passphrase: &str, salt: &[u8]) -> Vec<u8> {
    let key = super::pbkdf2_key::derive_aes256_key(passphrase, salt);
    let iv = random_iv_16();
    let ciphertext = encrypt_with_key_bytes(plaintext, &key, &iv);
    
    let mut result = Vec::with_capacity(salt.len() + 16 + ciphertext.len());
    result.extend_from_slice(salt);
    result.extend_from_slice(&iv);
    result.extend_from_slice(&ciphertext);
    result
}

// Full auto version: extracts salt and IV, derives key, and decrypts
pub fn decrypt_with_passphrase(combined: &[u8], passphrase: &str) -> Result<String, String> {
    if combined.len() < 32 {
        return Err("ciphertext too short (need at least salt + IV)".to_string());
    }
    
    let salt = &combined[0..16];
    let iv = &combined[16..32];
    let ciphertext = &combined[32..];
    
    let key = super::pbkdf2_key::derive_aes256_key(passphrase, salt);
    
    let mut iv_arr = [0u8; 16];
    iv_arr.copy_from_slice(iv);
    
    decrypt_with_key_bytes(ciphertext, &key, &iv_arr)
}

