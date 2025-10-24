// Triple DES CTR (Counter mode) 
use des::{TdesEde2, TdesEde3};
use des::cipher::{BlockEncrypt, KeyInit};
use getrandom::getrandom;

// Generate random nonce for CTR mode (8 bytes for 3DES)
pub fn random_nonce_8() -> [u8; 8] {
    let mut nonce = [0u8; 8];
    getrandom(&mut nonce).expect("random nonce failed");
    nonce
}

// Manual CTR implementation for 3DES (3-key)
fn ctr_process_3key(data: &[u8], key_bytes: &[u8; 24], nonce: &[u8; 8]) -> Vec<u8> {
    let cipher = TdesEde3::new(key_bytes.into());
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

// Manual CTR implementation for 3DES (2-key)
fn ctr_process_2key(data: &[u8], key_bytes: &[u8; 16], nonce: &[u8; 8]) -> Vec<u8> {
    let cipher = TdesEde2::new(key_bytes.into());
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

pub fn encrypt(plaintext: &str, key_text: &str, nonce: &[u8; 8], three_key: bool) -> Vec<u8> {
    let kb = key_text.as_bytes();
    
    if three_key {
        let mut key_bytes = [0u8; 24];
        let len = kb.len().min(24);
        key_bytes[..len].copy_from_slice(&kb[..len]);
        ctr_process_3key(plaintext.as_bytes(), &key_bytes, nonce)
    } else {
        let mut key_bytes = [0u8; 16];
        let len = kb.len().min(16);
        key_bytes[..len].copy_from_slice(&kb[..len]);
        ctr_process_2key(plaintext.as_bytes(), &key_bytes, nonce)
    }
}

pub fn decrypt(ciphertext: &[u8], key_text: &str, nonce: &[u8; 8], three_key: bool) -> Result<String, String> {
    let kb = key_text.as_bytes();
    
    let decrypted = if three_key {
        let mut key_bytes = [0u8; 24];
        let len = kb.len().min(24);
        key_bytes[..len].copy_from_slice(&kb[..len]);
        ctr_process_3key(ciphertext, &key_bytes, nonce)
    } else {
        let mut key_bytes = [0u8; 16];
        let len = kb.len().min(16);
        key_bytes[..len].copy_from_slice(&kb[..len]);
        ctr_process_2key(ciphertext, &key_bytes, nonce)
    };
    
    String::from_utf8(decrypted).map_err(|e| e.to_string())
}

pub fn encrypt_auto_nonce(plaintext: &str, key_text: &str, three_key: bool) -> Vec<u8> {
    let nonce = random_nonce_8();
    let ciphertext = encrypt(plaintext, key_text, &nonce, three_key);
    
    let mut result = Vec::with_capacity(8 + ciphertext.len());
    result.extend_from_slice(&nonce);
    result.extend_from_slice(&ciphertext);
    result
}

pub fn decrypt_auto_nonce(combined: &[u8], key_text: &str, three_key: bool) -> Result<String, String> {
    if combined.len() < 8 {
        return Err("ciphertext too short".to_string());
    }
    
    let nonce = &combined[0..8];
    let ciphertext = &combined[8..];
    
    let mut nonce_arr = [0u8; 8];
    nonce_arr.copy_from_slice(nonce);
    
    decrypt(ciphertext, key_text, &nonce_arr, three_key)
}
