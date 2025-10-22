// Triple DES (2-key or 3-key) in CBC mode with PKCS7
use cbc::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use des::{TdesEde2, TdesEde3};
use getrandom::getrandom;

type Tdes2KeyCbcEnc = cbc::Encryptor<TdesEde2>;
type Tdes2KeyCbcDec = cbc::Decryptor<TdesEde2>;
type Tdes3KeyCbcEnc = cbc::Encryptor<TdesEde3>;
type Tdes3KeyCbcDec = cbc::Decryptor<TdesEde3>;

pub fn random_iv_8() -> [u8; 8] {
    let mut iv = [0u8; 8];
    getrandom(&mut iv).expect("random iv failed");
    iv
}

pub fn encrypt(plaintext: &str, key_text: &str, iv: &[u8; 8], three_key: bool) -> Vec<u8> {
    let kb = key_text.as_bytes();
    if three_key {
        let mut key_arr = [0u8; 24];
        let n = kb.len().min(24);
        key_arr[..n].copy_from_slice(&kb[..n]);
        let cipher = Tdes3KeyCbcEnc::new(&key_arr.into(), iv.into());
        let mut buf = plaintext.as_bytes().to_vec();
        buf.resize(buf.len() + 8, 0u8);
        let len = plaintext.as_bytes().len();
        let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
        out.to_vec()
    } else {
        let mut key_arr = [0u8; 16];
        let n = kb.len().min(16);
        key_arr[..n].copy_from_slice(&kb[..n]);
        let cipher = Tdes2KeyCbcEnc::new(&key_arr.into(), iv.into());
        let mut buf = plaintext.as_bytes().to_vec();
        buf.resize(buf.len() + 8, 0u8);
        let len = plaintext.as_bytes().len();
        let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
        out.to_vec()
    }
}

pub fn decrypt(ciphertext: &[u8], key_text: &str, iv: &[u8; 8], three_key: bool) -> Result<String, String> {
    let kb = key_text.as_bytes();
    if three_key {
        let mut key_arr = [0u8; 24];
        let n = kb.len().min(24);
        key_arr[..n].copy_from_slice(&kb[..n]);
        let cipher = Tdes3KeyCbcDec::new(&key_arr.into(), iv.into());
        let mut buf = ciphertext.to_vec();
        match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
            Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
            Err(_) => Err("decrypt error".to_string()),
        }
    } else {
        let mut key_arr = [0u8; 16];
        let n = kb.len().min(16);
        key_arr[..n].copy_from_slice(&kb[..n]);
        let cipher = Tdes2KeyCbcDec::new(&key_arr.into(), iv.into());
        let mut buf = ciphertext.to_vec();
        match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
            Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
            Err(_) => Err("decrypt error".to_string()),
        }
    }
}

// Auto-IV version: generates IV and prepends it to ciphertext
pub fn encrypt_auto_iv(plaintext: &str, key_text: &str, three_key: bool) -> Vec<u8> {
    let iv = random_iv_8();
    let ciphertext = encrypt(plaintext, key_text, &iv, three_key);
    
    // Prepend IV to ciphertext: [IV][CIPHERTEXT]
    let mut result = Vec::with_capacity(8 + ciphertext.len());
    result.extend_from_slice(&iv);
    result.extend_from_slice(&ciphertext);
    result
}

// Auto-IV version: extracts IV from beginning of ciphertext
pub fn decrypt_auto_iv(combined: &[u8], key_text: &str, three_key: bool) -> Result<String, String> {
    if combined.len() < 8 {
        return Err("ciphertext too short".to_string());
    }
    
    // Extract IV (first 8 bytes) and ciphertext (rest)
    let iv = &combined[0..8];
    let ciphertext = &combined[8..];
    
    // Convert IV slice to array
    let mut iv_arr = [0u8; 8];
    iv_arr.copy_from_slice(iv);
    
    decrypt(ciphertext, key_text, &iv_arr, three_key)
}


