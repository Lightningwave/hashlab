// AES-192-CTR (Counter mode) - 192-bit key
use aes::Aes192;
use ctr::cipher::{KeyIvInit, StreamCipher};
use getrandom::getrandom;

// Generate random nonce for CTR mode (16 bytes)
pub fn random_nonce_16() -> [u8; 16] {
    let mut nonce = [0u8; 16];
    getrandom(&mut nonce).expect("random nonce failed");
    nonce
}

pub fn encrypt(plaintext: &str, key_text: &str, nonce: &[u8; 16]) -> Vec<u8> {
    let mut key_bytes = [0u8; 24];
    let kb = key_text.as_bytes();
    let len = kb.len().min(24);
    key_bytes[..len].copy_from_slice(&kb[..len]);

    let mut cipher = ctr::Ctr128BE::<Aes192>::new(&key_bytes.into(), nonce.into());
    let mut buffer = plaintext.as_bytes().to_vec();
    cipher.apply_keystream(&mut buffer);
    buffer
}

pub fn decrypt(ciphertext: &[u8], key_text: &str, nonce: &[u8; 16]) -> Result<String, String> {
    let mut key_bytes = [0u8; 24];
    let kb = key_text.as_bytes();
    let len = kb.len().min(24);
    key_bytes[..len].copy_from_slice(&kb[..len]);

    let mut cipher = ctr::Ctr128BE::<Aes192>::new(&key_bytes.into(), nonce.into());
    let mut buffer = ciphertext.to_vec();
    cipher.apply_keystream(&mut buffer);
    String::from_utf8(buffer).map_err(|e| e.to_string())
}

pub fn encrypt_auto_nonce(plaintext: &str, key_text: &str) -> Vec<u8> {
    let nonce = random_nonce_16();
    let ciphertext = encrypt(plaintext, key_text, &nonce);
    
    let mut result = Vec::with_capacity(16 + ciphertext.len());
    result.extend_from_slice(&nonce);
    result.extend_from_slice(&ciphertext);
    result
}

pub fn decrypt_auto_nonce(combined: &[u8], key_text: &str) -> Result<String, String> {
    if combined.len() < 16 {
        return Err("ciphertext too short".to_string());
    }
    
    let nonce = &combined[0..16];
    let ciphertext = &combined[16..];
    
    let mut nonce_arr = [0u8; 16];
    nonce_arr.copy_from_slice(nonce);
    
    decrypt(ciphertext, key_text, &nonce_arr)
}

