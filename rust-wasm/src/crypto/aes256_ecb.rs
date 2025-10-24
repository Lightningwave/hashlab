// AES-256-ECB with PKCS7 padding - 256-bit key
use aes::Aes256;
use cbc::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyInit};

pub fn encrypt(plaintext: &str, key_text: &str) -> Vec<u8> {
    let mut key = [0u8; 32];
    let kb = key_text.as_bytes();
    let n = kb.len().min(32);
    key[..n].copy_from_slice(&kb[..n]);

    let cipher = Aes256::new(&key.into());
    let mut buf = plaintext.as_bytes().to_vec();
    buf.resize(buf.len() + 16, 0u8);
    let len = plaintext.as_bytes().len();
    let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
    out.to_vec()
}

pub fn decrypt(ciphertext: &[u8], key_text: &str) -> Result<String, String> {
    let mut key = [0u8; 32];
    let kb = key_text.as_bytes();
    let n = kb.len().min(32);
    key[..n].copy_from_slice(&kb[..n]);

    let cipher = Aes256::new(&key.into());
    let mut buf = ciphertext.to_vec();
    match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
        Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
        Err(_) => Err("decrypt error".to_string()),
    }
}

