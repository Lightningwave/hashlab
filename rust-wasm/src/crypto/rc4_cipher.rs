// RC4 stream cipher 

use rc4::{Rc4, KeyInit, StreamCipher};
use rc4::consts::U16;

pub fn encrypt(plaintext: &str, key_text: &str) -> Vec<u8> {
    let mut key = [0u8; 16];
    let key_bytes = key_text.as_bytes();
    let len = key_bytes.len().min(16);
    key[..len].copy_from_slice(&key_bytes[..len]);
    
    let mut cipher = Rc4::<U16>::new(&key.into());
    let mut data = plaintext.as_bytes().to_vec();
    cipher.apply_keystream(&mut data);
    
    data
}

pub fn decrypt(ciphertext: &[u8], key_text: &str) -> Result<String, String> {
    let mut key = [0u8; 16];
    let key_bytes = key_text.as_bytes();
    let len = key_bytes.len().min(16);
    key[..len].copy_from_slice(&key_bytes[..len]);
    
    let mut cipher = Rc4::<U16>::new(&key.into());
    let mut data = ciphertext.to_vec();
    cipher.apply_keystream(&mut data);
    
    String::from_utf8(data).map_err(|_| "Decryption failed".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rc4_encrypt_decrypt() {
        let plaintext = "Hello, World!";
        let key = "secret_key";
        
        // Encrypt
        let ciphertext = encrypt(plaintext, key);
        
        // Decrypt
        let decrypted = decrypt(&ciphertext, key).unwrap();
        
        // Should match original
        assert_eq!(decrypted, plaintext);
    }

    #[test]
    fn test_rc4_empty_string() {
        let plaintext = "";
        let key = "key";
        
        let ciphertext = encrypt(plaintext, key);
        let decrypted = decrypt(&ciphertext, key).unwrap();
        
        assert_eq!(decrypted, plaintext);
    }

    #[test]
    fn test_rc4_different_keys() {
        let plaintext = "Test message";
        let key1 = "key1";
        let key2 = "key2";
        
        let ciphertext = encrypt(plaintext, key1);
        
        // Decrypting with wrong key should give different result
        let wrong_decrypt = decrypt(&ciphertext, key2).unwrap();
        assert_ne!(wrong_decrypt, plaintext);
        
        // Decrypting with correct key should work
        let correct_decrypt = decrypt(&ciphertext, key1).unwrap();
        assert_eq!(correct_decrypt, plaintext);
    }
}

