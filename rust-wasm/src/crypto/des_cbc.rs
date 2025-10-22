// DES-CBC with PKCS7 padding (separate file from 3DES)
use cbc::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use des::Des;
use getrandom::getrandom;

type DesCbcEnc = cbc::Encryptor<Des>;
type DesCbcDec = cbc::Decryptor<Des>;

pub fn random_iv_8() -> [u8; 8] {
    let mut iv = [0u8; 8];
    getrandom(&mut iv).expect("random iv failed");
    iv
}

pub fn encrypt(plaintext: &str, key_text: &str, iv: &[u8; 8]) -> Vec<u8> {
    let mut key = [0u8; 8];
    let kb = key_text.as_bytes();
    let n = kb.len().min(8);
    key[..n].copy_from_slice(&kb[..n]);
    let cipher = DesCbcEnc::new(&key.into(), iv.into());
    let mut buf = plaintext.as_bytes().to_vec();
    buf.resize(buf.len() + 8, 0u8);
    let len = plaintext.as_bytes().len();
    let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
    out.to_vec()
}

pub fn decrypt(ciphertext: &[u8], key_text: &str, iv: &[u8; 8]) -> Result<String, String> {
    let mut key = [0u8; 8];
    let kb = key_text.as_bytes();
    let n = kb.len().min(8);
    key[..n].copy_from_slice(&kb[..n]);
    let cipher = DesCbcDec::new(&key.into(), iv.into());
    let mut buf = ciphertext.to_vec();
    match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
        Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
        Err(_) => Err("decrypt error".to_string()),
    }
}

// Auto-IV version: generates IV and prepends it to ciphertext
pub fn encrypt_auto_iv(plaintext: &str, key_text: &str) -> Vec<u8> {
    let iv = random_iv_8();
    let ciphertext = encrypt(plaintext, key_text, &iv);
    
    // Prepend IV to ciphertext: [IV][CIPHERTEXT]
    let mut result = Vec::with_capacity(8 + ciphertext.len());
    result.extend_from_slice(&iv);
    result.extend_from_slice(&ciphertext);
    result
}

// Auto-IV version: extracts IV from beginning of ciphertext
pub fn decrypt_auto_iv(combined: &[u8], key_text: &str) -> Result<String, String> {
    if combined.len() < 8 {
        return Err("ciphertext too short".to_string());
    }
    
    // Extract IV (first 8 bytes) and ciphertext (rest)
    let iv = &combined[0..8];
    let ciphertext = &combined[8..];
    
    // Convert IV slice to array
    let mut iv_arr = [0u8; 8];
    iv_arr.copy_from_slice(iv);
    
    decrypt(ciphertext, key_text, &iv_arr)
}


