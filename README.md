# HashLab

A client-side cryptographic toolkit built with React and Rust/WebAssembly. All operations run locally in your browser - no data ever leaves your device.

## Features

###  Encryption
- **AES** (128/192/256-bit) - CBC, ECB, CTR modes
- **DES/3DES** - CBC, ECB, CTR modes (legacy, educational only)
- **ChaCha20** - Modern stream cipher
- **RC4** - Legacy stream cipher (insecure, educational only)

All encryption uses PBKDF2 key derivation with automatic IV/nonce handling.

###  Hashing
- **MD5** (legacy)
- **SHA-1** (legacy)
- **SHA-2** (SHA-256, SHA-512)
- **SHA-3** (SHA3-256)
- **Keccak-256**
- **BLAKE2b** (512-bit)
- **BLAKE3**

###  Encoding/Decoding
- **Base64** encode/decode
- **Hex** encode/decode
- **URL** encode/decode
- **ASCII ↔ Hex** converter

###  Steganography
- **Image Steganography** - Hide encrypted messages in PNG images
- **LSB Technique** - Uses Least Significant Bit steganography
- **AES-256-GCM Encryption** - Messages encrypted before hiding
- **Drag & Drop Interface** 
- **Invisible Modifications** - Output looks identical to original

## Tech Stack

- **Frontend**: React + Vite
- **Crypto**: Rust compiled to WebAssembly
- **Styling**: Inline styles, no frameworks

## Project Structure

```
hashlab/
├── frontend/                # React application
│   ├── src/
│   │   ├── views/          # UI components (pages, widgets)
│   │   ├── controllers/    # React hooks (business logic)
│   │   ├── models/         # Services (WASM interface)
│   │   └── router/         # Custom client-side router
│   └── package.json
│
├── rust-wasm/              # Rust crypto implementations
│   ├── src/
│   │   ├── crypto/        # Encryption algorithms
│   │   ├── hash/          # Hashing algorithms
│   │   ├── encoding/      # Encoding/decoding
│   │   └── steganography/ # Image steganography
│   └── Cargo.toml
│
└── pkg/                    # Compiled WASM output
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Rust and `wasm-pack`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hashlab.git
   cd hashlab
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Build Rust/WASM (if needed)**
   ```bash
   cd ../rust-wasm
   wasm-pack build --release --target web --out-dir ../pkg --out-name rust_wasm
   ```

4. **Run the development server**
   ```bash
   cd ../frontend
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## How It Works

### Encryption Example (AES-128-CBC)

**Encryption:**
```
1. User enters passphrase + plaintext
2. Generate random salt (16 bytes)
3. Derive key using PBKDF2-HMAC-SHA256 (10,000 iterations)
4. Generate random IV (16 bytes)
5. Encrypt with AES-128-CBC + PKCS7 padding
6. Combine: [salt | IV | ciphertext]
7. Encode to Base64 → output
```

**Decryption:**
```
1. User enters passphrase + ciphertext
2. Decode Base64 → [salt | IV | ciphertext]
3. Extract salt and IV from beginning
4. Derive key using PBKDF2 with extracted salt
5. Decrypt with extracted IV
6. Remove PKCS7 padding → plaintext
```

**Everything is automatic** - user only needs to remember their passphrase!

### Steganography Example (Image Hiding)

**Encoding:**
```
1. User uploads PNG image + enters message + passphrase
2. Generate random salt (16 bytes)
3. Derive key using PBKDF2-HMAC-SHA256 (100,000 iterations)
4. Encrypt message with AES-256-GCM
5. Combine: [salt | encrypted_data]
6. Hide in image using LSB steganography
7. Download modified PNG (looks identical!)
```

**Decoding:**
```
1. User uploads stego image + enters passphrase
2. Extract hidden data using LSB steganography
3. Extract salt from beginning of hidden data
4. Derive key using PBKDF2 with extracted salt
5. Decrypt with AES-256-GCM
6. Display original message
```

**Security**: Even if steganography is detected, the message is still encrypted!

## Security Notes

⚠️ **Educational Purpose**: This project is designed for learning cryptography concepts. While it uses standard algorithms correctly:

- Not audited by security professionals
- Use production-grade libraries for real applications
- Some algorithms (MD5, SHA-1, DES, RC4) are legacy/insecure
- Always use modern algorithms (AES-256, SHA-256+, ChaCha20) in production

✅ **Privacy**: All operations run in your browser. No data is sent to any server.

## Building for Production

```bash
# Build WASM
cd rust-wasm
wasm-pack build --release --target web --out-dir ../pkg --out-name rust_wasm

# Build frontend
cd ../frontend
npm run build

# Output in frontend/dist/
```

## Architecture

### Frontend (MVC Pattern)
- **Views**: React components (pages, widgets)
- **Controllers**: Custom hooks (state management, business logic)
- **Models**: Services that interface with WASM

### Backend (Rust/WASM)
- Pure Rust implementations of crypto algorithms
- Compiled to WebAssembly for browser execution
- No external crypto libraries (except `aes`, `sha2`, etc. crates)

### Router
- Custom lightweight router using History API
- No external dependencies (no React Router)

## Contributing

Contributions welcome! Please ensure:
- Code is clean and well-commented
- Security best practices are followed

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with Rust crates: `aes`, `sha2`, `sha3`, `blake2`, `blake3`, `des`, `chacha20`, `pbkdf2`, `aes-gcm`, `image`
- Inspired by tools like CyberChef and Online Hash Tools
- Created for educational purposes to learn cryptography and Rust/WASM

---



