/**
 * CryptoService - Model layer for cryptographic operations
 */
class CryptoService {
  constructor() {
    this.wasm = null;
    this.initPromise = null;
  }

  /**
   * Initialize WASM module 
   */
  async init() {
    if (this.wasm) return;
    
    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          const wasmModule = await import('/pkg/rust_wasm');
          await wasmModule.default();
          this.wasm = wasmModule;
          console.log('✓ WASM module loaded successfully');
        } catch (error) {
          console.error('✗ Failed to initialize WASM:', error);
          throw new Error(`WASM initialization failed: ${error.message}`);
        }
      })();
    }
    
    await this.initPromise;
  }

  /**
   * @param {string} input -
   * @returns {Promise<string>} 
   */
  async hashMD5(input) {
    await this.init();
    
    if (input === null || input === undefined) {
      throw new Error('Input cannot be null or undefined');
    }
    
    try {
      return this.wasm.hash_md5(input);
    } catch (error) {
      throw new Error(`MD5 hashing failed: ${error.message}`);
    }
  }

  /**
   * Hash input using SHA-1
   */
  async hashSHA1(input) {
    await this.init();
    if (input === null || input === undefined) {
      throw new Error('Input cannot be null or undefined');
    }
    try {
      return this.wasm.hash_sha1(input);
    } catch (error) {
      throw new Error(`SHA-1 hashing failed: ${error.message}`);
    }
  }

  /**
   * Hash input using SHA-256
   */
  async hashSHA256(input) {
    await this.init();
    if (input === null || input === undefined) {
      throw new Error('Input cannot be null or undefined');
    }
    try {
      return this.wasm.hash_sha256(input);
    } catch (error) {
      throw new Error(`SHA-256 hashing failed: ${error.message}`);
    }
  }

  /**
   * Hash input using SHA-512
   */
  async hashSHA512(input) {
    await this.init();
    if (input === null || input === undefined) {
      throw new Error('Input cannot be null or undefined');
    }
    try {
      return this.wasm.hash_sha512(input);
    } catch (error) {
      throw new Error(`SHA-512 hashing failed: ${error.message}`);
    }
  }

  /**
   * Hash input using SHA3-256
   */
  async hashSHA3_256(input) {
    await this.init();
    if (input === null || input === undefined) {
      throw new Error('Input cannot be null or undefined');
    }
    try {
      return this.wasm.hash_sha3_256(input);
    } catch (error) {
      throw new Error(`SHA3-256 hashing failed: ${error.message}`);
    }
  }

  /**
   * Hash input using Keccak-256
   */
  async hashKeccak256(input) {
    await this.init();
    if (input === null || input === undefined) {
      throw new Error('Input cannot be null or undefined');
    }
    try {
      return this.wasm.hash_keccak256(input);
    } catch (error) {
      throw new Error(`Keccak-256 hashing failed: ${error.message}`);
    }
  }

  /**
   * Hash input using BLAKE2b-512
   */
  async hashBLAKE2b(input) {
    await this.init();
    if (input === null || input === undefined) {
      throw new Error('Input cannot be null or undefined');
    }
    try {
      return this.wasm.hash_blake2b(input);
    } catch (error) {
      throw new Error(`BLAKE2b hashing failed: ${error.message}`);
    }
  }

  /**
   * Hash input using BLAKE3
   */
  async hashBLAKE3(input) {
    await this.init();
    if (input === null || input === undefined) {
      throw new Error('Input cannot be null or undefined');
    }
    try {
      return this.wasm.hash_blake3(input);
    } catch (error) {
      throw new Error(`BLAKE3 hashing failed: ${error.message}`);
    }
  }

 
}

export default new CryptoService();