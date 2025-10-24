#![recursion_limit = "1024"]

use wasm_bindgen::prelude::*;

mod hash;
mod crypto;
mod encoding;
mod steganography;

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
// CRYPTO FUNCTIONS 
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

// ============================================================================
// STEGANOGRAPHY FUNCTIONS
// ============================================================================

/// Calculate the capacity of a PNG image for hiding data (in bytes)
#[wasm_bindgen]
pub fn steg_calculate_capacity(width: u32, height: u32) -> usize {
    steganography::lsb_png::calculate_capacity(width, height)
}

/// Encode encrypted data into a PNG image
/// Returns the modified PNG image as bytes
#[wasm_bindgen]
pub fn steg_encode_png(
    image_data: &[u8],
    message: &str,
    passphrase: &str,
) -> Result<Vec<u8>, JsValue> {
    use image::ImageFormat;
    use std::io::Cursor;
    
    // Load PNG image
    let img = image::load_from_memory_with_format(image_data, ImageFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("Failed to load PNG: {}", e)))?;
    
    // Generate salt
    let mut salt = [0u8; 16];
    getrandom::getrandom(&mut salt)
        .map_err(|e| JsValue::from_str(&format!("Failed to generate salt: {}", e)))?;
    
    // Derive encryption key
    let key = steganography::aes_gcm_cipher::derive_key_from_passphrase(passphrase, &salt);
    
    // Encrypt the message
    let encrypted = steganography::aes_gcm_cipher::encrypt(message.as_bytes(), &key)
        .map_err(|e| JsValue::from_str(&format!("Encryption failed: {}", e)))?;
    
    // Combine salt + encrypted data
    let mut data_to_hide = Vec::with_capacity(16 + encrypted.len());
    data_to_hide.extend_from_slice(&salt);
    data_to_hide.extend_from_slice(&encrypted);
    
    // Encode into image
    let steg_img = steganography::lsb_png::encode(&img, &data_to_hide)
        .map_err(|e| JsValue::from_str(&format!("Steganography encoding failed: {}", e)))?;
    
    // Convert back to PNG bytes
    let mut output = Vec::new();
    steg_img.write_to(&mut Cursor::new(&mut output), ImageFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("Failed to write PNG: {}", e)))?;
    
    Ok(output)
}

/// Decode and decrypt data from a PNG image
/// Returns the hidden message
#[wasm_bindgen]
pub fn steg_decode_png(
    image_data: &[u8],
    passphrase: &str,
) -> Result<String, JsValue> {
    use image::ImageFormat;
    
    // Load PNG image
    let img = image::load_from_memory_with_format(image_data, ImageFormat::Png)
        .map_err(|e| JsValue::from_str(&format!("Failed to load PNG: {}", e)))?;
    
    // Extract hidden data
    let hidden_data = steganography::lsb_png::decode(&img)
        .map_err(|e| JsValue::from_str(&format!("Steganography decoding failed: {}", e)))?;
    
    if hidden_data.len() < 16 {
        return Err(JsValue::from_str("Invalid hidden data: too short"));
    }
    
    // Extract salt and encrypted data
    let salt = &hidden_data[0..16];
    let encrypted = &hidden_data[16..];
    
    // Derive decryption key
    let key = steganography::aes_gcm_cipher::derive_key_from_passphrase(passphrase, salt);
    
    // Decrypt the message
    let decrypted = steganography::aes_gcm_cipher::decrypt(encrypted, &key)
        .map_err(|e| JsValue::from_str(&format!("Decryption failed: {}", e)))?;
    
    // Convert to string
    String::from_utf8(decrypted)
        .map_err(|e| JsValue::from_str(&format!("Invalid UTF-8: {}", e)))
}