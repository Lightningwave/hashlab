// DES-CTR (Counter mode) - manual implementation to avoid type system issues
use des::Des;
use des::cipher::{BlockEncrypt, KeyInit};
use getrandom::getrandom;

// Generate random nonce for CTR mode (8 bytes for DES)
pub fn random_nonce_8() -> [u8; 8] {
    let mut nonce = [0u8; 8];
    getrandom(&mut nonce).expect("random nonce failed");
    nonce
}

// Manual CTR implementation for DES
// CTR mode works by encrypting a counter and XORing with plaintext
fn ctr_process(data: &[u8], key_bytes: &[u8; 8], nonce: &[u8; 8]) -> Vec<u8> {
    let cipher = Des::new(key_bytes.into());
    let mut result = Vec::with_capacity(data.len());
    
    // Convert nonce to u64 counter
    let mut counter = u64::from_be_bytes(*nonce);
    
    let mut offset = 0;
    while offset < data.len() {
        // Encrypt the counter
        let counter_bytes = counter.to_be_bytes();
        let mut block = counter_bytes;
        cipher.encrypt_block((&mut block).into());
        
        // XOR with plaintext/ciphertext
        let remaining = data.len() - offset;
        let to_process = remaining.min(8);
        
        for i in 0..to_process {
            result.push(data[offset + i] ^ block[i]);
        }
        
        offset += to_process;
        counter = counter.wrapping_add(1);
    }
    
    result
}

pub fn encrypt(plaintext: &str, key_text: &str, nonce: &[u8; 8]) -> Vec<u8> {
    let mut key_bytes = [0u8; 8];
    let kb = key_text.as_bytes();
    let len = kb.len().min(8);
    key_bytes[..len].copy_from_slice(&kb[..len]);

    ctr_process(plaintext.as_bytes(), &key_bytes, nonce)
}

pub fn decrypt(ciphertext: &[u8], key_text: &str, nonce: &[u8; 8]) -> Result<String, String> {
    let mut key_bytes = [0u8; 8];
    let kb = key_text.as_bytes();
    let len = kb.len().min(8);
    key_bytes[..len].copy_from_slice(&kb[..len]);

    let decrypted = ctr_process(ciphertext, &key_bytes, nonce);
    String::from_utf8(decrypted).map_err(|e| e.to_string())
}

pub fn encrypt_auto_nonce(plaintext: &str, key_text: &str) -> Vec<u8> {
    let nonce = random_nonce_8();
    let ciphertext = encrypt(plaintext, key_text, &nonce);
    
    let mut result = Vec::with_capacity(8 + ciphertext.len());
    result.extend_from_slice(&nonce);
    result.extend_from_slice(&ciphertext);
    result
}

pub fn decrypt_auto_nonce(combined: &[u8], key_text: &str) -> Result<String, String> {
    if combined.len() < 8 {
        return Err("ciphertext too short".to_string());
    }
    
    let nonce = &combined[0..8];
    let ciphertext = &combined[8..];
    
    let mut nonce_arr = [0u8; 8];
    nonce_arr.copy_from_slice(nonce);
    
    decrypt(ciphertext, key_text, &nonce_arr)
}

