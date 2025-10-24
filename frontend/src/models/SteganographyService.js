/**
 * SteganographyService - Model layer for image steganography operations
 * Hides encrypted messages inside PNG images using LSB technique
 */
class SteganographyService {
  constructor() {
    this.wasm = null;
    this.initPromise = null;
  }

  async init() {
    if (this.wasm) return;
    if (!this.initPromise) {
      this.initPromise = (async () => {
        try {
          const wasmModule = await import('@pkg/rust_wasm.js');
          await wasmModule.default();
          this.wasm = wasmModule;
          console.log('✓ WASM module loaded for steganography');
        } catch (error) {
          console.error('✗ Failed to initialize WASM:', error);
          throw new Error(`WASM initialization failed: ${error.message}`);
        }
      })();
    }
    await this.initPromise;
  }

  /**
   * Calculate the capacity of an image for hiding data
   * @param {File} imageFile - PNG image file
   * @returns {Promise<number>} Capacity in bytes
   */
  async calculateCapacity(imageFile) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const capacity = this.wasm.steg_calculate_capacity(img.width, img.height);
          resolve(capacity);
        } catch (error) {
          reject(new Error(`Failed to calculate capacity: ${error.message}`));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  /**
   * Encode a message into a PNG image
   * @param {File} imageFile - PNG image file
   * @param {string} message - Secret message to hide
   * @param {string} passphrase - Password for encryption
   * @returns {Promise<Blob>} Modified PNG image with hidden message
   */
  async encodeMessage(imageFile, message, passphrase) {
    await this.init();
    
    if (!imageFile || !imageFile.type.includes('png')) {
      throw new Error('Only PNG images are supported');
    }
    
    if (!message || message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }
    
    if (!passphrase || passphrase.length < 6) {
      throw new Error('Passphrase must be at least 6 characters');
    }
    
    try {
      // Read image file as ArrayBuffer
      const imageData = await this.readFileAsArrayBuffer(imageFile);
      
      // Call WASM function to encode
      const resultData = this.wasm.steg_encode_png(
        new Uint8Array(imageData),
        message,
        passphrase
      );
      
      // Convert result to Blob
      return new Blob([resultData], { type: 'image/png' });
    } catch (error) {
      throw new Error(`Encoding failed: ${error.message || error}`);
    }
  }

  /**
   * Decode a message from a PNG image
   * @param {File} imageFile - PNG image file with hidden message
   * @param {string} passphrase - Password for decryption
   * @returns {Promise<string>} Decoded message
   */
  async decodeMessage(imageFile, passphrase) {
    await this.init();
    
    if (!imageFile || !imageFile.type.includes('png')) {
      throw new Error('Only PNG images are supported');
    }
    
    if (!passphrase) {
      throw new Error('Passphrase is required');
    }
    
    try {
      // Read image file as ArrayBuffer
      const imageData = await this.readFileAsArrayBuffer(imageFile);
      
      // Call WASM function to decode
      const message = this.wasm.steg_decode_png(
        new Uint8Array(imageData),
        passphrase
      );
      
      return message;
    } catch (error) {
      throw new Error(`Decoding failed: ${error.message || error}`);
    }
  }

  /**
   * Helper: Read file as ArrayBuffer
   */
  readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Get image dimensions
   * @param {File} imageFile - Image file
   * @returns {Promise<{width: number, height: number}>}
   */
  getImageDimensions(imageFile) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @returns {Promise<boolean>}
   */
  async validateImageFile(file) {
    if (!file) return false;
    if (!file.type.includes('png')) return false;
    
    try {
      const dims = await this.getImageDimensions(file);
      return dims.width > 0 && dims.height > 0;
    } catch {
      return false;
    }
  }
}

export default new SteganographyService();

