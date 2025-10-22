// PBKDF2 key derivation for AES keys
// Simple implementation for learning purposes

use pbkdf2::pbkdf2_hmac;
use sha2::Sha256;

pub fn derive_aes128_key(passphrase: &str, salt: &[u8]) -> [u8; 16] {
    let mut key = [0u8; 16];
    pbkdf2_hmac::<Sha256>(passphrase.as_bytes(), salt, 10000, &mut key);
    key
}

pub fn derive_aes192_key(passphrase: &str, salt: &[u8]) -> [u8; 24] {
    let mut key = [0u8; 24];
    pbkdf2_hmac::<Sha256>(passphrase.as_bytes(), salt, 10000, &mut key);
    key
}

pub fn derive_aes256_key(passphrase: &str, salt: &[u8]) -> [u8; 32] {
    let mut key = [0u8; 32];
    pbkdf2_hmac::<Sha256>(passphrase.as_bytes(), salt, 10000, &mut key);
    key
}

pub fn derive_des_key(passphrase: &str, salt: &[u8]) -> [u8; 8] {
    let mut key = [0u8; 8];
    pbkdf2_hmac::<Sha256>(passphrase.as_bytes(), salt, 10000, &mut key);
    key
}

pub fn derive_tdes_key(passphrase: &str, salt: &[u8], three_key: bool) -> Vec<u8> {
    let needed = if three_key { 24 } else { 16 };
    let mut key = vec![0u8; needed];
    pbkdf2_hmac::<Sha256>(passphrase.as_bytes(), salt, 10000, &mut key);
    key
}
