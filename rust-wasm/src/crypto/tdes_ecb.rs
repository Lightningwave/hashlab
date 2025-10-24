// Triple DES (2-key or 3-key) in ECB mode with PKCS7

use cbc::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use des::{TdesEde2, TdesEde3};

type Tdes2KeyEcbEnc = cbc::Encryptor<TdesEde2>;
type Tdes2KeyEcbDec = cbc::Decryptor<TdesEde2>;
type Tdes3KeyEcbEnc = cbc::Encryptor<TdesEde3>;
type Tdes3KeyEcbDec = cbc::Decryptor<TdesEde3>;

pub fn encrypt(plaintext: &str, key_text: &str, three_key: bool) -> Vec<u8> {
    let kb = key_text.as_bytes();
    let zero_iv = [0u8; 8]; // Not used in ECB, but required by API
    
    if three_key {
        let mut key_arr = [0u8; 24];
        let n = kb.len().min(24);
        key_arr[..n].copy_from_slice(&kb[..n]);
        let cipher = Tdes3KeyEcbEnc::new(&key_arr.into(), &zero_iv.into());
        let mut buf = plaintext.as_bytes().to_vec();
        buf.resize(buf.len() + 8, 0u8);
        let len = plaintext.as_bytes().len();
        let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
        out.to_vec()
    } else {
        let mut key_arr = [0u8; 16];
        let n = kb.len().min(16);
        key_arr[..n].copy_from_slice(&kb[..n]);
        let cipher = Tdes2KeyEcbEnc::new(&key_arr.into(), &zero_iv.into());
        let mut buf = plaintext.as_bytes().to_vec();
        buf.resize(buf.len() + 8, 0u8);
        let len = plaintext.as_bytes().len();
        let out = cipher.encrypt_padded_mut::<Pkcs7>(&mut buf, len).expect("encrypt failed");
        out.to_vec()
    }
}

pub fn decrypt(ciphertext: &[u8], key_text: &str, three_key: bool) -> Result<String, String> {
    let kb = key_text.as_bytes();
    let zero_iv = [0u8; 8]; // Not used in ECB, but required by API
    
    if three_key {
        let mut key_arr = [0u8; 24];
        let n = kb.len().min(24);
        key_arr[..n].copy_from_slice(&kb[..n]);
        let cipher = Tdes3KeyEcbDec::new(&key_arr.into(), &zero_iv.into());
        let mut buf = ciphertext.to_vec();
        match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
            Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
            Err(_) => Err("decrypt error".to_string()),
        }
    } else {
        let mut key_arr = [0u8; 16];
        let n = kb.len().min(16);
        key_arr[..n].copy_from_slice(&kb[..n]);
        let cipher = Tdes2KeyEcbDec::new(&key_arr.into(), &zero_iv.into());
        let mut buf = ciphertext.to_vec();
        match cipher.decrypt_padded_mut::<Pkcs7>(&mut buf) {
            Ok(bytes) => String::from_utf8(bytes.to_vec()).map_err(|_| "not utf-8".to_string()),
            Err(_) => Err("decrypt error".to_string()),
        }
    }
}

