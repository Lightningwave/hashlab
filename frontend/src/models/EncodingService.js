/**
 * EncodingService - Model layer for encoding/decoding operations
 */
class EncodingService {
  constructor() {
    this.wasm = null;
    this.initPromise = null;
  }

  async init() {
    if (this.wasm) return;
    if (!this.initPromise) {
      this.initPromise = (async () => {
        const wasmModule = await import('/hashlab/pkg/rust_wasm.js');
        await wasmModule.default();
        this.wasm = wasmModule;
      })();
    }
    await this.initPromise;
  }

  async encodeBase64(input) { await this.init(); return this.wasm.encode_base64(input); }
  async decodeBase64(input) { await this.init(); return this.wasm.decode_base64(input); }
  async encodeHex(input) { await this.init(); return this.wasm.encode_hex(input); }
  async decodeHex(input) { await this.init(); return this.wasm.decode_hex(input); }
  async encodeURL(input) { await this.init(); return this.wasm.encode_url(input); }
  async decodeURL(input) { await this.init(); return this.wasm.decode_url(input); }
  async asciiToHex(input) { await this.init(); return this.wasm.ascii_to_hex(input); }
  async hexToAscii(input) { await this.init(); return this.wasm.hex_to_ascii(input); }
}

export default new EncodingService();