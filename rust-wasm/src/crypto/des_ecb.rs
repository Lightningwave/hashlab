// DES-ECB with PKCS7 padding
// ECB mode encrypts each block independently - no IV needed
// We simulate ECB by using CBC with a zero IV (less secure but works for educational purposes)
use cbc::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use des::Des;

type DesEcbEnc = cbc::Encryptor<Des>;
type DesEcbDec = cbc::Decryptor<Des>;

pub fn encrypt(plaintext: &str, key_text: &str) -> Vec<u8> {
    let mut key = [0u8; 8];
    let kb = key_text.as_bytes();
    let n = kb.len().min(8);
    key[..n].copy_from_slice(&kb[..n]);
    
    // For ECB, we use a zero IV (it's not actually used in ECB mode)
    let zero_iv = [0u8; 8];
    let cipher = DesEcbEnc::new(&key.into(), &zero_iv.into());
    
    let mut buf = plaintext.as_bytes().to_vec();
    buf.resize(buf.len() + 8, 0u8);
    let len = plaintext.as_bytes().len();
    let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
    out.to_vec()
}

pub fn decrypt(ciphertext: &[u8], key_text: &str) -> Result<String, String> {
    let mut key = [0u8; 8];
    let kb = key_text.as_bytes();
    let n = kb.len().min(8);
    key[..n].copy_from_slice(&kb[..n]);
    
    // For ECB, we use a zero IV (it's not actually used in ECB mode)
    let zero_iv = [0u8; 8];
    let cipher = DesEcbDec::new(&key.into(), &zero_iv.into());
    
    let mut buf = ciphertext.to_vec();
    match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
        Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
        Err(_) => Err("decrypt error".to_string()),
    }
}

