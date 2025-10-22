import React, { useEffect, useState } from 'react';
import { ModernSelect } from './ModernSelect';

export const EncryptionWidget = ({ 
  algorithm, setAlgorithm, 
  cipherMode, setCipherMode, 
  keySize, setKeySize, 
  plaintext, setPlaintext, 
  cipherBase64, setCipherBase64, 
  passphrase, setPassphrase, 
  output, loading, error, message, 
  onEncrypt, onDecrypt 
}) => {
  const [mode, setMode] = useState('encrypt'); 

  useEffect(() => {
    setPlaintext('');
    setCipherBase64('');
    setPassphrase('');
  }, [algorithm, cipherMode, keySize, setPlaintext, setCipherBase64, setPassphrase]);

  // Options for dropdowns
  const algorithmOptions = [
    { value: 'aes', label: 'AES' },
    { value: 'des', label: 'DES (Legacy)' },
    { value: '3des', label: 'Triple DES (Legacy)' },
    { value: 'rc4', label: 'RC4 (Stream Cipher - Insecure)' },
    { value: 'chacha20', label: 'ChaCha20 (Modern Stream Cipher)' }
  ];

  const modeOptions = [
    { value: 'cbc', label: 'CBC - Cipher Block Chaining' },
    { value: 'ecb', label: 'ECB - Electronic Codebook' },
    { value: 'ctr', label: 'CTR - Counter Mode' }
  ];

  const getKeySizeOptions = () => {
    if (algorithm === 'aes') {
      return [
        { value: '128', label: '128-bit (Fast & Secure)' },
        { value: '192', label: '192-bit (High Security)' },
        { value: '256', label: '256-bit (Maximum Security)' }
      ];
    } else if (algorithm === 'des') {
      return [{ value: '56', label: '56-bit (Legacy)' }];
    } else if (algorithm === 'rc4') {
      return [{ value: '128', label: '128-bit (Stream Cipher)' }];
    } else if (algorithm === 'chacha20') {
      return [{ value: '256', label: '256-bit (Stream Cipher)' }];
    } else {
      return [{ value: '168', label: '168-bit (Legacy)' }];
    }
  };

  // Stream ciphers don't use modes
  const isStreamCipher = algorithm === 'rc4' || algorithm === 'chacha20';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Algorithm Settings */}
      <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: isStreamCipher ? '1fr' : '1fr 1fr 1fr' }}>
        <ModernSelect
          label="Algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          options={algorithmOptions}
        />
        {!isStreamCipher && (
          <>
            <ModernSelect
              label="Mode"
              value={cipherMode}
              onChange={(e) => setCipherMode(e.target.value)}
              options={modeOptions}
            />
            <ModernSelect
              label="Key Size"
              value={keySize}
              onChange={(e) => setKeySize(e.target.value)}
              options={getKeySizeOptions()}
            />
          </>
        )}
      </div>

      {/* Encrypt/Decrypt Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '24px', borderBottom: '2px solid #e0e0e0' }}>
        <button
          onClick={() => setMode('encrypt')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: mode === 'encrypt' ? '#667eea' : 'transparent',
            color: mode === 'encrypt' ? 'white' : '#666',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          Encrypt
        </button>
        <button
          onClick={() => setMode('decrypt')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: mode === 'decrypt' ? '#667eea' : 'transparent',
            color: mode === 'decrypt' ? 'white' : '#666',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          Decrypt
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: 500 }}>Passphrase</label>
          <input 
            value={passphrase} 
            onChange={(e) => setPassphrase(e.target.value)} 
            placeholder="Enter your passphrase" 
            type="password"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px' 
            }} 
          />
        </div>

        {mode === 'encrypt' ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 500 }}>Text to Encrypt</label>
              <textarea 
                value={plaintext} 
                onChange={(e) => setPlaintext(e.target.value)} 
                placeholder="Enter the text you want to encrypt..."
                rows={8} 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: '8px',
                  resize: 'vertical'
                }} 
              />
            </div>
            <button 
              onClick={onEncrypt} 
              disabled={loading || !plaintext || !passphrase} 
              style={{ 
                padding: '12px 32px', 
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: (loading || !plaintext || !passphrase) ? '#ccc' : '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: (loading || !plaintext || !passphrase) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseEnter={(e) => { if (!loading && plaintext && passphrase) e.target.style.backgroundColor = '#5a67d8'; }}
              onMouseLeave={(e) => { if (!loading && plaintext && passphrase) e.target.style.backgroundColor = '#667eea'; }}
            >
              {loading ? 'Encrypting...' : 'Encrypt'}
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 500 }}>Ciphertext (Base64)</label>
              <textarea 
                value={cipherBase64} 
                onChange={(e) => setCipherBase64(e.target.value)} 
                placeholder="Paste the encrypted ciphertext here..."
                rows={8} 
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: '8px',
                  resize: 'vertical',
                  fontFamily: 'monospace',
                  fontSize: '13px'
                }} 
              />
            </div>
            <button 
              onClick={onDecrypt} 
              disabled={loading || !cipherBase64 || !passphrase} 
              style={{ 
                padding: '12px 32px', 
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: (loading || !cipherBase64 || !passphrase) ? '#ccc' : '#48bb78', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: (loading || !cipherBase64 || !passphrase) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseEnter={(e) => { if (!loading && cipherBase64 && passphrase) e.target.style.backgroundColor = '#38a169'; }}
              onMouseLeave={(e) => { if (!loading && cipherBase64 && passphrase) e.target.style.backgroundColor = '#48bb78'; }}
            >
              {loading ? 'Decrypting...' : 'Decrypt'}
            </button>
          </>
        )}
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div style={{ padding: '12px 16px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '8px', marginBottom: '20px' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fee', color: '#c33', border: '2px solid #fcc', borderRadius: '8px', marginTop: '16px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '16px' }}>
            {mode === 'encrypt' ? 'Encryption Failed' : 'Decryption Failed'}
          </div>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{error}</div>
        </div>
      )}

      {!error && output && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8f9fa', border: '2px solid #667eea', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontWeight: 600, color: '#333' }}>
              {mode === 'encrypt' ? 'Encrypted Output' : 'Decrypted Output'}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
                alert('Copied to clipboard!');
              }}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
          <div style={{ 
            fontFamily: 'monospace', 
            wordBreak: 'break-all', 
            backgroundColor: 'white', 
            padding: '12px', 
            borderRadius: '6px',
            fontSize: '13px',
            color: '#333',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {output}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#e9ecef', borderRadius: '8px', fontSize: '14px' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>How it works:</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#6c757d' }}>
          {algorithm === 'aes' && (
            <>
              <li>Your passphrase is converted to a {keySize}-bit key using PBKDF2 with SHA-256 (10,000 iterations).</li>
              {cipherMode === 'cbc' && <li>A random salt (16 bytes) and IV (16 bytes) are generated and prepended to the ciphertext.</li>}
              {cipherMode === 'ctr' && <li>A random salt (16 bytes) and nonce (16 bytes) are generated and prepended to the ciphertext.</li>}
              {cipherMode === 'ecb' && <li>No IV or salt is used - each block is encrypted independently. Not recommended for production.</li>}
              <li>Everything is included in one Base64 string - just remember your passphrase to decrypt.</li>
            </>
          )}
          {(algorithm === 'des' || algorithm === '3des') && (
            <>
              <li>Your passphrase is used directly as the key (padded or truncated to required length).</li>
              {cipherMode === 'cbc' && <li>A random IV is generated and prepended to the ciphertext.</li>}
              {cipherMode === 'ctr' && <li>A random nonce is generated and prepended to the ciphertext.</li>}
              {cipherMode === 'ecb' && <li>No IV is used - each block is encrypted independently.</li>}
              <li><strong>Warning:</strong> {algorithm.toUpperCase()} is outdated. Use AES for production.</li>
            </>
          )}
          {algorithm === 'rc4' && (
            <>
              <li>RC4 is a stream cipher that uses a 128-bit key derived from your passphrase.</li>
              <li>No IV or nonce is required for stream ciphers.</li>
              <li><strong>Warning:</strong> RC4 is deprecated and insecure. Use ChaCha20 or AES instead.</li>
            </>
          )}
          {algorithm === 'chacha20' && (
            <>
              <li>ChaCha20 is a modern stream cipher using a 256-bit key derived from your passphrase.</li>
              <li>A random 96-bit nonce is generated and prepended to the ciphertext.</li>
              <li>Used in TLS 1.3, WireGuard, and other modern protocols.</li>
            </>
          )}
          <li><strong>Privacy:</strong> All operations run locally in your browser. No data leaves your device.</li>
        </ul>
      </div>

      {!isStreamCipher && (
        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '14px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>Mode Explanation:</h4>
          {cipherMode === 'cbc' && (
            <div style={{ color: '#6c757d' }}>
              <p><strong>CBC (Cipher Block Chaining):</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Each block is XORed with the previous ciphertext block before encryption</li>
                <li>Uses an Initialization Vector (IV) for the first block</li>
                <li>More secure than ECB - identical plaintext blocks produce different ciphertext</li>
                <li>Requires padding for blocks that aren't full</li>
                <li>Good for general-purpose encryption</li>
              </ul>
            </div>
          )}
          {cipherMode === 'ecb' && (
            <div style={{ color: '#6c757d' }}>
              <p><strong>ECB (Electronic Codebook):</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Each block is encrypted independently with the same key</li>
                <li>No IV required - simpler but less secure</li>
                <li>Identical plaintext blocks produce identical ciphertext blocks</li>
                <li>Can reveal patterns in the data</li>
                <li><strong>Not recommended</strong> - use CBC or CTR instead</li>
              </ul>
            </div>
          )}
          {cipherMode === 'ctr' && (
            <div style={{ color: '#6c757d' }}>
              <p><strong>CTR (Counter Mode):</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Turns a block cipher into a stream cipher</li>
                <li>Uses a nonce (number used once) combined with a counter</li>
                <li>Each block is XORed with encrypted counter value</li>
                <li>No padding required - can handle any data length</li>
                <li>Highly parallelizable - faster than CBC</li>
                <li><strong>Secure and efficient</strong> - recommended for performance</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EncryptionWidget;