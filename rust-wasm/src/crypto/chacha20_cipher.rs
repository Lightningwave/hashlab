// ChaCha20 stream cipher (modern and secure)

use chacha20::ChaCha20;
use chacha20::cipher::{KeyIvInit, StreamCipher};
use getrandom::getrandom;

pub fn random_nonce() -> [u8; 12] {
    let mut nonce = [0u8; 12];
    getrandom(&mut nonce).expect("random nonce generation failed");
    nonce
}

pub fn encrypt_auto_nonce(plaintext: &str, key_text: &str) -> Vec<u8> {
    let mut key = [0u8; 32];
    let key_bytes = key_text.as_bytes();
    let len = key_bytes.len().min(32);
    key[..len].copy_from_slice(&key_bytes[..len]);
    
    let nonce = random_nonce();
    let mut cipher = ChaCha20::new(&key.into(), &nonce.into());
    let mut data = plaintext.as_bytes().to_vec();
    cipher.apply_keystream(&mut data);
    
    let mut result = Vec::with_capacity(12 + data.len());
    result.extend_from_slice(&nonce);
    result.extend_from_slice(&data);
    result
}

pub fn decrypt_auto_nonce(combined: &[u8], key_text: &str) -> Result<String, String> {
    if combined.len() < 12 {
        return Err("Ciphertext too short".to_string());
    }
    
    let mut key = [0u8; 32];
    let key_bytes = key_text.as_bytes();
    let len = key_bytes.len().min(32);
    key[..len].copy_from_slice(&key_bytes[..len]);
    
    let nonce_bytes = &combined[0..12];
    let ciphertext = &combined[12..];
    
    let mut nonce = [0u8; 12];
    nonce.copy_from_slice(nonce_bytes);
    
    let mut cipher = ChaCha20::new(&key.into(), &nonce.into());
    let mut data = ciphertext.to_vec();
    cipher.apply_keystream(&mut data);
    
    String::from_utf8(data).map_err(|_| "Decryption failed".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_chacha20_encrypt_decrypt() {
        let plaintext = "Hello, ChaCha20!";
        let key = "my_secure_passphrase";
        
        // Encrypt
        let combined = encrypt_auto_nonce(plaintext, key);
        
        // Should have nonce (12 bytes) + ciphertext
        assert!(combined.len() > 12);
        
        // Decrypt
        let decrypted = decrypt_auto_nonce(&combined, key).unwrap();
        
        // Should match original
        assert_eq!(decrypted, plaintext);
    }

    #[test]
    fn test_chacha20_empty_string() {
        let plaintext = "";
        let key = "key";
        
        let combined = encrypt_auto_nonce(plaintext, key);
        let decrypted = decrypt_auto_nonce(&combined, key).unwrap();
        
        assert_eq!(decrypted, plaintext);
    }

    #[test]
    fn test_chacha20_different_keys() {
        let plaintext = "Secret message";
        let key1 = "correct_key";
        let key2 = "wrong_key";
        
        let combined = encrypt_auto_nonce(plaintext, key1);
        
        // Decrypting with wrong key should give different result
        let wrong_decrypt = decrypt_auto_nonce(&combined, key2).unwrap();
        assert_ne!(wrong_decrypt, plaintext);
        
        // Decrypting with correct key should work
        let correct_decrypt = decrypt_auto_nonce(&combined, key1).unwrap();
        assert_eq!(correct_decrypt, plaintext);
    }

    #[test]
    fn test_chacha20_long_text() {
        let plaintext = "This is a longer message to test ChaCha20 encryption. \
                        It should handle multiple blocks of data efficiently and securely.";
        let key = "long_message_test_key";
        
        let combined = encrypt_auto_nonce(plaintext, key);
        let decrypted = decrypt_auto_nonce(&combined, key).unwrap();
        
        assert_eq!(decrypted, plaintext);
    }
}

