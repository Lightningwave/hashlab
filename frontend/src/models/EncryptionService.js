
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function bytesToBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const sub = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(null, Array.from(sub));
  }
  return btoa(binary);
}

function base64ToBytes(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export class EncryptionService {
  constructor() {
    this.wasm = null;
    this.initPromise = null;
  }

  async init() {
    if (this.wasm) return;
    if (!this.initPromise) {
      this.initPromise = (async () => {
        const wasmModule = await import('../../../pkg/rust_wasm');
        await wasmModule.default();
        this.wasm = wasmModule;
      })();
    }
    await this.initPromise;
  }

  // AES-128-CBC with PBKDF2 key derivation
  async aes128Encrypt(plaintext, passphrase, salt) {
    await this.init();
    const key = new Uint8Array(this.wasm.derive_aes128_key(passphrase, salt));
    const iv = new Uint8Array(this.wasm.aes128_cbc_random_iv());
    const cipher = new Uint8Array(this.wasm.aes128_cbc_encrypt(plaintext, new TextDecoder().decode(key), iv));
    return { ivBase64: bytesToBase64(iv), cipherBase64: bytesToBase64(cipher), saltBase64: bytesToBase64(salt) };
  }
  async aes128Decrypt(cipherBase64, ivBase64, passphrase, salt) {
    await this.init();
    const key = new Uint8Array(this.wasm.derive_aes128_key(passphrase, salt));
    const cipher = base64ToBytes(cipherBase64);
    const iv = base64ToBytes(ivBase64);
    return this.wasm.aes128_cbc_decrypt(cipher, new TextDecoder().decode(key), iv);
  }

  // AES-256-CBC with PBKDF2 key derivation
  async aes256Encrypt(plaintext, passphrase, salt) {
    await this.init();
    const key = new Uint8Array(this.wasm.derive_aes256_key(passphrase, salt));
    const iv = new Uint8Array(this.wasm.aes256_cbc_random_iv());
    const cipher = new Uint8Array(this.wasm.aes256_cbc_encrypt(plaintext, new TextDecoder().decode(key), iv));
    return { ivBase64: bytesToBase64(iv), cipherBase64: bytesToBase64(cipher), saltBase64: bytesToBase64(salt) };
  }
  async aes256Decrypt(cipherBase64, ivBase64, passphrase, salt) {
    await this.init();
    const key = new Uint8Array(this.wasm.derive_aes256_key(passphrase, salt));
    const cipher = base64ToBytes(cipherBase64);
    const iv = base64ToBytes(ivBase64);
    return this.wasm.aes256_cbc_decrypt(cipher, new TextDecoder().decode(key), iv);
  }

  // DES-CBC (8-byte IV)
  async desEncrypt(plaintext, key) {
    await this.init();
    const iv = crypto.getRandomValues(new Uint8Array(8));
    const cipher = new Uint8Array(this.wasm.des_cbc_encrypt(plaintext, key, iv));
    return { ivBase64: bytesToBase64(iv), cipherBase64: bytesToBase64(cipher) };
  }
  async desDecrypt(cipherBase64, ivBase64, key) {
    await this.init();
    const cipher = base64ToBytes(cipherBase64);
    const iv = base64ToBytes(ivBase64);
    return this.wasm.des_cbc_decrypt(cipher, key, iv);
  }

  // Triple DES-CBC 
  async tdesEncrypt(plaintext, key, threeKey = true) {
    await this.init();
    const iv = crypto.getRandomValues(new Uint8Array(8));
    const cipher = new Uint8Array(this.wasm.tdes_cbc_encrypt(plaintext, key, iv, threeKey));
    return { ivBase64: bytesToBase64(iv), cipherBase64: bytesToBase64(cipher) };
  }
  async tdesDecrypt(cipherBase64, ivBase64, key, threeKey = true) {
    await this.init();
    const cipher = base64ToBytes(cipherBase64);
    const iv = base64ToBytes(ivBase64);
    return this.wasm.tdes_cbc_decrypt(cipher, key, iv, threeKey);
  }

  async aes128EncryptAutoIv(plaintext, passphrase, salt) {
    await this.init();
    const combined = new Uint8Array(this.wasm.aes128_cbc_encrypt_with_passphrase(plaintext, passphrase, salt));
    return bytesToBase64(combined);
  }

  async aes192EncryptAutoIv(plaintext, passphrase, salt) {
    await this.init();
    const key = new Uint8Array(this.wasm.derive_aes192_key(passphrase, salt));
    const ivAndCipher = new Uint8Array(this.wasm.aes192_cbc_encrypt_auto_iv(plaintext, new TextDecoder().decode(key)));
    const combined = new Uint8Array(salt.length + ivAndCipher.length);
    combined.set(salt, 0);
    combined.set(ivAndCipher, salt.length);
    return bytesToBase64(combined);
  }
  async aes128DecryptAutoIv(cipherBase64, passphrase) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    return this.wasm.aes128_cbc_decrypt_with_passphrase(combined, passphrase);
  }

  async aes192DecryptAutoIv(cipherBase64, passphrase) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    const salt = combined.slice(0, 16);
    const ivAndCipher = combined.slice(16);
    const key = new Uint8Array(this.wasm.derive_aes192_key(passphrase, salt));
    return this.wasm.aes192_cbc_decrypt_auto_iv(ivAndCipher, new TextDecoder().decode(key));
  }

  async aes256EncryptAutoIv(plaintext, passphrase, salt) {
    await this.init();
    const combined = new Uint8Array(this.wasm.aes256_cbc_encrypt_with_passphrase(plaintext, passphrase, salt));
    return bytesToBase64(combined);
  }
  
  async aes256DecryptAutoIv(cipherBase64, passphrase) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    return this.wasm.aes256_cbc_decrypt_with_passphrase(combined, passphrase);
  }

  async desEncryptAutoIv(plaintext, key) {
    await this.init();
    const combined = new Uint8Array(this.wasm.des_cbc_encrypt_auto_iv(plaintext, key));
    return bytesToBase64(combined);
  }
  async desDecryptAutoIv(cipherBase64, key) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    return this.wasm.des_cbc_decrypt_auto_iv(combined, key);
  }

  async tdesEncryptAutoIv(plaintext, key, threeKey = true) {
    await this.init();
    const combined = new Uint8Array(this.wasm.tdes_cbc_encrypt_auto_iv(plaintext, key, threeKey));
    return bytesToBase64(combined);
  }
  async tdesDecryptAutoIv(cipherBase64, key, threeKey = true) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    return this.wasm.tdes_cbc_decrypt_auto_iv(combined, key, threeKey);
  }

  // ECB methods 
  async aes128EcbEncrypt(plaintext, passphrase) {
    await this.init();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = new Uint8Array(this.wasm.derive_aes128_key(passphrase, salt));
    const ciphertext = new Uint8Array(this.wasm.aes128_ecb_encrypt(plaintext, new TextDecoder().decode(key)));
    return bytesToBase64(ciphertext);
  }

  async aes128EcbDecrypt(cipherBase64, passphrase) {
    await this.init();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = new Uint8Array(this.wasm.derive_aes128_key(passphrase, salt));
    const cipher = base64ToBytes(cipherBase64);
    return this.wasm.aes128_ecb_decrypt(cipher, new TextDecoder().decode(key));
  }

  async aes192EcbEncrypt(plaintext, passphrase) {
    await this.init();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = new Uint8Array(this.wasm.derive_aes192_key(passphrase, salt));
    const ciphertext = new Uint8Array(this.wasm.aes192_ecb_encrypt(plaintext, new TextDecoder().decode(key)));
    return bytesToBase64(ciphertext);
  }

  async aes192EcbDecrypt(cipherBase64, passphrase) {
    await this.init();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = new Uint8Array(this.wasm.derive_aes192_key(passphrase, salt));
    const cipher = base64ToBytes(cipherBase64);
    return this.wasm.aes192_ecb_decrypt(cipher, new TextDecoder().decode(key));
  }

  async aes256EcbEncrypt(plaintext, passphrase) {
    await this.init();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = new Uint8Array(this.wasm.derive_aes256_key(passphrase, salt));
    const ciphertext = new Uint8Array(this.wasm.aes256_ecb_encrypt(plaintext, new TextDecoder().decode(key)));
    return bytesToBase64(ciphertext);
  }

  async aes256EcbDecrypt(cipherBase64, passphrase) {
    await this.init();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = new Uint8Array(this.wasm.derive_aes256_key(passphrase, salt));
    const cipher = base64ToBytes(cipherBase64);
    return this.wasm.aes256_ecb_decrypt(cipher, new TextDecoder().decode(key));
  }

  // CTR methods 
  async aes128CtrEncrypt(plaintext, passphrase, salt) {
    await this.init();
    const key = new Uint8Array(this.wasm.derive_aes128_key(passphrase, salt));
    const nonceAndCipher = new Uint8Array(this.wasm.aes128_ctr_encrypt_auto_nonce(plaintext, new TextDecoder().decode(key)));
    const combined = new Uint8Array(salt.length + nonceAndCipher.length);
    combined.set(salt, 0);
    combined.set(nonceAndCipher, salt.length);
    return bytesToBase64(combined);
  }

  async aes128CtrDecrypt(cipherBase64, passphrase) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    const salt = combined.slice(0, 16);
    const nonceAndCipher = combined.slice(16);
    const key = new Uint8Array(this.wasm.derive_aes128_key(passphrase, salt));
    return this.wasm.aes128_ctr_decrypt_auto_nonce(nonceAndCipher, new TextDecoder().decode(key));
  }

  async aes192CtrEncrypt(plaintext, passphrase, salt) {
    await this.init();
    const key = new Uint8Array(this.wasm.derive_aes192_key(passphrase, salt));
    const nonceAndCipher = new Uint8Array(this.wasm.aes192_ctr_encrypt_auto_nonce(plaintext, new TextDecoder().decode(key)));
    const combined = new Uint8Array(salt.length + nonceAndCipher.length);
    combined.set(salt, 0);
    combined.set(nonceAndCipher, salt.length);
    return bytesToBase64(combined);
  }

  async aes192CtrDecrypt(cipherBase64, passphrase) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    const salt = combined.slice(0, 16);
    const nonceAndCipher = combined.slice(16);
    const key = new Uint8Array(this.wasm.derive_aes192_key(passphrase, salt));
    return this.wasm.aes192_ctr_decrypt_auto_nonce(nonceAndCipher, new TextDecoder().decode(key));
  }

  async aes256CtrEncrypt(plaintext, passphrase, salt) {
    await this.init();
    const key = new Uint8Array(this.wasm.derive_aes256_key(passphrase, salt));
    const nonceAndCipher = new Uint8Array(this.wasm.aes256_ctr_encrypt_auto_nonce(plaintext, new TextDecoder().decode(key)));
    const combined = new Uint8Array(salt.length + nonceAndCipher.length);
    combined.set(salt, 0);
    combined.set(nonceAndCipher, salt.length);
    return bytesToBase64(combined);
  }

  async aes256CtrDecrypt(cipherBase64, passphrase) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    const salt = combined.slice(0, 16);
    const nonceAndCipher = combined.slice(16);
    const key = new Uint8Array(this.wasm.derive_aes256_key(passphrase, salt));
    return this.wasm.aes256_ctr_decrypt_auto_nonce(nonceAndCipher, new TextDecoder().decode(key));
  }

  // DES/3DES ECB methods 
  async desEcbEncrypt(plaintext, key) {
    await this.init();
    const ciphertext = new Uint8Array(this.wasm.des_ecb_encrypt(plaintext, key));
    return bytesToBase64(ciphertext);
  }

  async desEcbDecrypt(cipherBase64, key) {
    await this.init();
    const cipher = base64ToBytes(cipherBase64);
    return this.wasm.des_ecb_decrypt(cipher, key);
  }

  async tdesEcbEncrypt(plaintext, key, threeKey = true) {
    await this.init();
    const ciphertext = new Uint8Array(this.wasm.tdes_ecb_encrypt(plaintext, key, threeKey));
    return bytesToBase64(ciphertext);
  }

  async tdesEcbDecrypt(cipherBase64, key, threeKey = true) {
    await this.init();
    const cipher = base64ToBytes(cipherBase64);
    return this.wasm.tdes_ecb_decrypt(cipher, key, threeKey);
  }

  // DES/3DES CTR methods 
  async desCtrEncrypt(plaintext, key) {
    await this.init();
    const combined = new Uint8Array(this.wasm.des_ctr_encrypt_auto_nonce(plaintext, key));
    return bytesToBase64(combined);
  }

  async desCtrDecrypt(cipherBase64, key) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    return this.wasm.des_ctr_decrypt_auto_nonce(combined, key);
  }

  async tdesCtrEncrypt(plaintext, key, threeKey = true) {
    await this.init();
    const combined = new Uint8Array(this.wasm.tdes_ctr_encrypt_auto_nonce(plaintext, key, threeKey));
    return bytesToBase64(combined);
  }

  async tdesCtrDecrypt(cipherBase64, key, threeKey = true) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    return this.wasm.tdes_ctr_decrypt_auto_nonce(combined, key, threeKey);
  }

  // RC4 - Legacy stream cipher 
  async rc4Encrypt(plaintext, key) {
    await this.init();
    const ciphertext = new Uint8Array(this.wasm.rc4_encrypt(plaintext, key));
    return bytesToBase64(ciphertext);
  }

  async rc4Decrypt(cipherBase64, key) {
    await this.init();
    const cipher = base64ToBytes(cipherBase64);
    return this.wasm.rc4_decrypt(cipher, key);
  }

  // ChaCha20 - Modern secure stream cipher
  async chacha20Encrypt(plaintext, key) {
    await this.init();
    const combined = new Uint8Array(this.wasm.chacha20_encrypt_auto_nonce(plaintext, key));
    return bytesToBase64(combined);
  }

  async chacha20Decrypt(cipherBase64, key) {
    await this.init();
    const combined = base64ToBytes(cipherBase64);
    return this.wasm.chacha20_decrypt_auto_nonce(combined, key);
  }
}

export default new EncryptionService();


