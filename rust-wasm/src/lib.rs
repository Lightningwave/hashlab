#![recursion_limit = "1024"]

use wasm_bindgen::prelude::*;

// Module declarations
mod hash;
mod crypto;
mod encoding;

// ============================================================================
// HASH FUNCTIONS
// ============================================================================

/// Hash a string using MD5
#[wasm_bindgen]
pub fn hash_md5(input: &str) -> String {
    hash::md5::hash_string(input)
}

/// Hash raw bytes using MD5
#[wasm_bindgen]
pub fn hash_md5_bytes(input: &[u8]) -> String {
    hash::md5::hash(input)
}

// Future hash functions:
#[wasm_bindgen]
pub fn hash_sha1(input: &str) -> String {
    hash::sha1::hash_string(input)
}

#[wasm_bindgen]
pub fn hash_sha256(input: &str) -> String {
    hash::sha256::hash_string(input)
}

#[wasm_bindgen]
pub fn hash_sha512(input: &str) -> String {
    hash::sha512::hash_string(input)
}

#[wasm_bindgen]
pub fn hash_sha3_256(input: &str) -> String {
    hash::sha3_256::hash(input)
}

#[wasm_bindgen]
pub fn hash_keccak256(input: &str) -> String {
    hash::keccak256::hash(input)
}

#[wasm_bindgen]
pub fn hash_blake2b(input: &str) -> String {
    hash::blake2b::hash(input)
}

#[wasm_bindgen]
pub fn hash_blake3(input: &str) -> String {
    hash::blake3_hash::hash(input)
}

// ============================================================================
// CRYPTO FUNCTIONS (Future)
// ============================================================================

#[wasm_bindgen]
pub fn aes128_cbc_random_iv() -> Vec<u8> { crypto::aes128_cbc::random_iv_16().to_vec() }

#[wasm_bindgen]
pub fn aes128_cbc_encrypt(plaintext: &str, key: &str, iv: &[u8]) -> Vec<u8> {
    let mut iv_arr = [0u8; 16]; iv_arr.copy_from_slice(&iv[..16]);
    crypto::aes128_cbc::encrypt(plaintext, key, &iv_arr)
}

#[wasm_bindgen]
pub fn aes128_cbc_decrypt(cipher: &[u8], key: &str, iv: &[u8]) -> Result<String, JsValue> {
    let mut iv_arr = [0u8; 16]; iv_arr.copy_from_slice(&iv[..16]);
    crypto::aes128_cbc::decrypt(cipher, key, &iv_arr).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn aes256_cbc_random_iv() -> Vec<u8> { crypto::aes256_cbc::random_iv_16().to_vec() }

#[wasm_bindgen]
pub fn aes256_cbc_encrypt(plaintext: &str, key: &str, iv: &[u8]) -> Vec<u8> {
    let mut iv_arr = [0u8; 16]; iv_arr.copy_from_slice(&iv[..16]);
    crypto::aes256_cbc::encrypt(plaintext, key, &iv_arr)
}

#[wasm_bindgen]
pub fn aes256_cbc_decrypt(cipher: &[u8], key: &str, iv: &[u8]) -> Result<String, JsValue> {
    let mut iv_arr = [0u8; 16]; iv_arr.copy_from_slice(&iv[..16]);
    crypto::aes256_cbc::decrypt(cipher, key, &iv_arr).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn des_cbc_encrypt(plaintext: &str, key: &str, iv: &[u8]) -> Vec<u8> {
    let mut iv_arr = [0u8; 8];
    iv_arr.copy_from_slice(&iv[..8]);
    crypto::des_cbc::encrypt(plaintext, key, &iv_arr)
}

#[wasm_bindgen]
pub fn des_cbc_decrypt(cipher: &[u8], key: &str, iv: &[u8]) -> Result<String, JsValue> {
    let mut iv_arr = [0u8; 8];
    iv_arr.copy_from_slice(&iv[..8]);
    crypto::des_cbc::decrypt(cipher, key, &iv_arr)
        .map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn tdes_cbc_encrypt(plaintext: &str, key: &str, iv: &[u8], three_key: bool) -> Vec<u8> {
    let mut iv_arr = [0u8; 8]; iv_arr.copy_from_slice(&iv[..8]);
    crypto::tdes_cbc::encrypt(plaintext, key, &iv_arr, three_key)
}

#[wasm_bindgen]
pub fn tdes_cbc_decrypt(cipher: &[u8], key: &str, iv: &[u8], three_key: bool) -> Result<String, JsValue> {
    let mut iv_arr = [0u8; 8]; iv_arr.copy_from_slice(&iv[..8]);
    crypto::tdes_cbc::decrypt(cipher, key, &iv_arr, three_key).map_err(|e| JsValue::from_str(&e))
}

// Auto-IV versions - these handle IV automatically
#[wasm_bindgen]
pub fn aes128_cbc_encrypt_auto_iv(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes128_cbc::encrypt_auto_iv(plaintext, key)
}

#[wasm_bindgen]
pub fn aes128_cbc_decrypt_auto_iv(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes128_cbc::decrypt_auto_iv(combined, key).map_err(|e| JsValue::from_str(&e))
}

// Full auto versions - handle passphrase, salt, and IV automatically
#[wasm_bindgen]
pub fn aes128_cbc_encrypt_with_passphrase(plaintext: &str, passphrase: &str, salt: &[u8]) -> Vec<u8> {
    crypto::aes128_cbc::encrypt_with_passphrase(plaintext, passphrase, salt)
}

#[wasm_bindgen]
pub fn aes128_cbc_decrypt_with_passphrase(combined: &[u8], passphrase: &str) -> Result<String, JsValue> {
    crypto::aes128_cbc::decrypt_with_passphrase(combined, passphrase).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn aes256_cbc_encrypt_auto_iv(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes256_cbc::encrypt_auto_iv(plaintext, key)
}

#[wasm_bindgen]
pub fn aes256_cbc_decrypt_auto_iv(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes256_cbc::decrypt_auto_iv(combined, key).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn aes256_cbc_encrypt_with_passphrase(plaintext: &str, passphrase: &str, salt: &[u8]) -> Vec<u8> {
    crypto::aes256_cbc::encrypt_with_passphrase(plaintext, passphrase, salt)
}

#[wasm_bindgen]
pub fn aes256_cbc_decrypt_with_passphrase(combined: &[u8], passphrase: &str) -> Result<String, JsValue> {
    crypto::aes256_cbc::decrypt_with_passphrase(combined, passphrase).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn des_cbc_encrypt_auto_iv(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::des_cbc::encrypt_auto_iv(plaintext, key)
}

#[wasm_bindgen]
pub fn des_cbc_decrypt_auto_iv(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::des_cbc::decrypt_auto_iv(combined, key).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn tdes_cbc_encrypt_auto_iv(plaintext: &str, key: &str, three_key: bool) -> Vec<u8> {
    crypto::tdes_cbc::encrypt_auto_iv(plaintext, key, three_key)
}

#[wasm_bindgen]
pub fn tdes_cbc_decrypt_auto_iv(combined: &[u8], key: &str, three_key: bool) -> Result<String, JsValue> {
    crypto::tdes_cbc::decrypt_auto_iv(combined, key, three_key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// DES-ECB FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn des_ecb_encrypt(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::des_ecb::encrypt(plaintext, key)
}

#[wasm_bindgen]
pub fn des_ecb_decrypt(cipher: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::des_ecb::decrypt(cipher, key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// 3DES-ECB FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn tdes_ecb_encrypt(plaintext: &str, key: &str, three_key: bool) -> Vec<u8> {
    crypto::tdes_ecb::encrypt(plaintext, key, three_key)
}

#[wasm_bindgen]
pub fn tdes_ecb_decrypt(cipher: &[u8], key: &str, three_key: bool) -> Result<String, JsValue> {
    crypto::tdes_ecb::decrypt(cipher, key, three_key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// DES-CTR FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn des_ctr_encrypt_auto_nonce(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::des_ctr::encrypt_auto_nonce(plaintext, key)
}

#[wasm_bindgen]
pub fn des_ctr_decrypt_auto_nonce(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::des_ctr::decrypt_auto_nonce(combined, key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// 3DES-CTR FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn tdes_ctr_encrypt_auto_nonce(plaintext: &str, key: &str, three_key: bool) -> Vec<u8> {
    crypto::tdes_ctr::encrypt_auto_nonce(plaintext, key, three_key)
}

#[wasm_bindgen]
pub fn tdes_ctr_decrypt_auto_nonce(combined: &[u8], key: &str, three_key: bool) -> Result<String, JsValue> {
    crypto::tdes_ctr::decrypt_auto_nonce(combined, key, three_key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// AES-192-CBC FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn aes192_cbc_random_iv() -> Vec<u8> { crypto::aes192_cbc::random_iv_16().to_vec() }

#[wasm_bindgen]
pub fn aes192_cbc_encrypt(plaintext: &str, key: &str, iv: &[u8]) -> Vec<u8> {
    let mut iv_arr = [0u8; 16]; iv_arr.copy_from_slice(&iv[..16]);
    crypto::aes192_cbc::encrypt(plaintext, key, &iv_arr)
}

#[wasm_bindgen]
pub fn aes192_cbc_decrypt(cipher: &[u8], key: &str, iv: &[u8]) -> Result<String, JsValue> {
    let mut iv_arr = [0u8; 16]; iv_arr.copy_from_slice(&iv[..16]);
    crypto::aes192_cbc::decrypt(cipher, key, &iv_arr).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn aes192_cbc_encrypt_auto_iv(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes192_cbc::encrypt_auto_iv(plaintext, key)
}

#[wasm_bindgen]
pub fn aes192_cbc_decrypt_auto_iv(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes192_cbc::decrypt_auto_iv(combined, key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// AES-ECB FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn aes128_ecb_encrypt(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes128_ecb::encrypt(plaintext, key)
}

#[wasm_bindgen]
pub fn aes128_ecb_decrypt(cipher: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes128_ecb::decrypt(cipher, key).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn aes192_ecb_encrypt(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes192_ecb::encrypt(plaintext, key)
}

#[wasm_bindgen]
pub fn aes192_ecb_decrypt(cipher: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes192_ecb::decrypt(cipher, key).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn aes256_ecb_encrypt(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes256_ecb::encrypt(plaintext, key)
}

#[wasm_bindgen]
pub fn aes256_ecb_decrypt(cipher: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes256_ecb::decrypt(cipher, key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// AES-CTR FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn aes128_ctr_encrypt_auto_nonce(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes128_ctr::encrypt_auto_nonce(plaintext, key)
}

#[wasm_bindgen]
pub fn aes128_ctr_decrypt_auto_nonce(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes128_ctr::decrypt_auto_nonce(combined, key).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn aes192_ctr_encrypt_auto_nonce(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes192_ctr::encrypt_auto_nonce(plaintext, key)
}

#[wasm_bindgen]
pub fn aes192_ctr_decrypt_auto_nonce(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes192_ctr::decrypt_auto_nonce(combined, key).map_err(|e| JsValue::from_str(&e))
}

#[wasm_bindgen]
pub fn aes256_ctr_encrypt_auto_nonce(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::aes256_ctr::encrypt_auto_nonce(plaintext, key)
}

#[wasm_bindgen]
pub fn aes256_ctr_decrypt_auto_nonce(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::aes256_ctr::decrypt_auto_nonce(combined, key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// PBKDF2 KEY DERIVATION FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn derive_aes192_key(passphrase: &str, salt: &[u8]) -> Vec<u8> {
    crypto::pbkdf2_key::derive_aes192_key(passphrase, salt).to_vec()
}

// ============================================================================
// ENCODING FUNCTIONS (Future)
// ============================================================================

#[wasm_bindgen]
pub fn encode_base64(input: &str) -> String {
    encoding::base64_simple::encode(input)
}

#[wasm_bindgen]
pub fn decode_base64(input: &str) -> Result<String, JsValue> {
    encoding::base64_simple::decode(input)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn encode_hex(input: &str) -> String {
    encoding::hex_simple::encode(input)
}

#[wasm_bindgen]
pub fn decode_hex(input: &str) -> Result<String, JsValue> {
    encoding::hex_simple::decode(input)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn encode_url(input: &str) -> String {
    encoding::url_simple::encode(input)
}

#[wasm_bindgen]
pub fn decode_url(input: &str) -> Result<String, JsValue> {
    encoding::url_simple::decode(input)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

#[wasm_bindgen]
pub fn ascii_to_hex(input: &str) -> String {
    encoding::ascii_hex::ascii_to_hex(input)
}

#[wasm_bindgen]
pub fn hex_to_ascii(input: &str) -> Result<String, JsValue> {
    encoding::ascii_hex::hex_to_ascii(input)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

// ============================================================================
// KEY DERIVATION FUNCTIONS
// ============================================================================

#[wasm_bindgen]
pub fn derive_aes128_key(passphrase: &str, salt: &[u8]) -> Vec<u8> {
    crypto::pbkdf2_key::derive_aes128_key(passphrase, salt).to_vec()
}

#[wasm_bindgen]
pub fn derive_aes256_key(passphrase: &str, salt: &[u8]) -> Vec<u8> {
    crypto::pbkdf2_key::derive_aes256_key(passphrase, salt).to_vec()
}

#[wasm_bindgen]
pub fn derive_des_key(passphrase: &str, salt: &[u8]) -> Vec<u8> {
    crypto::pbkdf2_key::derive_des_key(passphrase, salt).to_vec()
}

#[wasm_bindgen]
pub fn derive_tdes_key(passphrase: &str, salt: &[u8], three_key: bool) -> Vec<u8> {
    crypto::pbkdf2_key::derive_tdes_key(passphrase, salt, three_key)
}

// ============================================================================
// RC4 STREAM CIPHER (LEGACY - FOR EDUCATIONAL PURPOSES ONLY)
// ============================================================================

#[wasm_bindgen]
pub fn rc4_encrypt(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::rc4_cipher::encrypt(plaintext, key)
}

#[wasm_bindgen]
pub fn rc4_decrypt(ciphertext: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::rc4_cipher::decrypt(ciphertext, key).map_err(|e| JsValue::from_str(&e))
}

// ============================================================================
// CHACHA20 STREAM CIPHER (MODERN & SECURE)
// ============================================================================

#[wasm_bindgen]
pub fn chacha20_encrypt_auto_nonce(plaintext: &str, key: &str) -> Vec<u8> {
    crypto::chacha20_cipher::encrypt_auto_nonce(plaintext, key)
}

#[wasm_bindgen]
pub fn chacha20_decrypt_auto_nonce(combined: &[u8], key: &str) -> Result<String, JsValue> {
    crypto::chacha20_cipher::decrypt_auto_nonce(combined, key).map_err(|e| JsValue::from_str(&e))
}