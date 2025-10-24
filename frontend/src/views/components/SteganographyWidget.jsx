import React, { useState, useRef } from 'react';
import { useSteganography } from '../../controllers/hooks/useSteganography';

export const SteganographyWidget = () => {
  const {
    isLoading,
    error,
    capacity,
    imagePreview,
    encodeMessage,
    decodeMessage,
    loadImagePreview,
    calculateCapacity,
    clearError,
  } = useSteganography();

  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [imageDimensions, setImageDimensions] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleImageSelect = async (file) => {
    if (!file) return;

    if (!file.type.includes('png')) {
      alert('Only PNG images are supported');
      return;
    }

    setImageFile(file);
    loadImagePreview(file);
    setDecodedMessage('');
    clearError();

    // Get dimensions and capacity
    try {
      const img = new Image();
      img.onload = async () => {
        setImageDimensions({ width: img.width, height: img.height });
        const cap = await calculateCapacity(file);
      };
      img.src = URL.createObjectURL(file);
    } catch (err) {
      console.error('Error loading image:', err);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const handleEncode = async () => {
    if (!imageFile || !message || !passphrase) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const resultBlob = await encodeMessage(imageFile, message, passphrase);
      
      // Download the result
      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stego_${imageFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Message encoded successfully! Image downloaded.');
    } catch (err) {
      console.error('Encoding error:', err);
    }
  };

  const handleDecode = async () => {
    if (!imageFile || !passphrase) {
      alert('Please upload an image and enter the passphrase');
      return;
    }

    try {
      const result = await decodeMessage(imageFile, passphrase);
      setDecodedMessage(result);
    } catch (err) {
      console.error('Decoding error:', err);
      setDecodedMessage('');
    }
  };

  const resetForm = () => {
    setImageFile(null);
    setMessage('');
    setPassphrase('');
    setDecodedMessage('');
    setImageDimensions(null);
    clearError();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Mode Selector */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => switchMode('encode')}
          style={{
            flex: 1,
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: mode === 'encode' ? '#667eea' : '#f1f3f5',
            color: mode === 'encode' ? 'white' : '#4a5568',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Encode Message
        </button>
        <button
          onClick={() => switchMode('decode')}
          style={{
            flex: 1,
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: mode === 'decode' ? '#667eea' : '#f1f3f5',
            color: mode === 'decode' ? 'white' : '#4a5568',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Decode Message
        </button>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          marginBottom: '20px',
          padding: '40px',
          border: `2px dashed ${isDragOver ? '#667eea' : '#e2e8f0'}`,
          borderRadius: '12px',
          backgroundColor: isDragOver ? '#f7fafc' : '#f8f9fa',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
          {imageFile ? 'Drop another PNG image or click to change' : 'Drop PNG image here or click to select'}
        </h3>
        <p style={{ margin: '0', color: '#718096', fontSize: '14px' }}>
          Only PNG images are supported
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '8px', color: '#2d3748' }}>Image Info</h3>
              {imageDimensions && (
                <p style={{ marginBottom: '4px', color: '#4a5568' }}>
                  <strong>Dimensions:</strong> {imageDimensions.width} × {imageDimensions.height}
                </p>
              )}
              {capacity !== null && (
                <p style={{ marginBottom: '4px', color: '#4a5568' }}>
                  <strong>Capacity:</strong> {capacity} bytes (~{Math.floor(capacity / 1024)} KB)
                </p>
              )}
              {imageFile && (
                <p style={{ color: '#4a5568' }}>
                  <strong>File:</strong> {imageFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Encode Mode */}
      {mode === 'encode' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              Secret Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message..."
              disabled={isLoading}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
            {capacity !== null && message && (
              <p style={{
                marginTop: '4px',
                fontSize: '12px',
                color: message.length > capacity ? '#e53e3e' : '#4a5568'
              }}>
                {message.length} / {capacity} bytes
                {message.length > capacity && ' - Message too large!'}
              </p>
            )}
          </div>
        </>
      )}

      {/* Passphrase */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#4a5568'
        }}>
          Passphrase (min 6 characters)
        </label>
        <input
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Enter a strong passphrase..."
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={mode === 'encode' ? handleEncode : handleDecode}
        disabled={isLoading || !imageFile || !passphrase || (mode === 'encode' && !message)}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: isLoading || !imageFile || !passphrase || (mode === 'encode' && !message)
            ? '#cbd5e0'
            : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isLoading || !imageFile || !passphrase || (mode === 'encode' && !message)
            ? 'not-allowed'
            : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {isLoading
          ? (mode === 'encode' ? 'Encoding...' : 'Decoding...')
          : (mode === 'encode' ? 'Encode & Download' : 'Decode Message')}
      </button>

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          backgroundColor: '#fed7d7',
          color: '#c53030',
          border: '1px solid #fc8181',
          borderRadius: '8px',
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Decoded Message Display */}
      {mode === 'decode' && decodedMessage && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#c6f6d5',
          border: '1px solid #9ae6b4',
          borderRadius: '8px',
        }}>
          <h3 style={{ marginBottom: '8px', color: '#2f855a' }}>Decoded Message:</h3>
          <p style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: '#22543d',
            fontFamily: 'monospace',
          }}>
            {decodedMessage}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
      }}>
        <h3 style={{ marginBottom: '8px', color: '#2d3748' }}>How it works:</h3>
        <ul style={{ marginLeft: '20px', color: '#4a5568', fontSize: '14px' }}>
          <li>Messages are encrypted with AES-256-GCM before hiding</li>
          <li>Uses LSB (Least Significant Bit) steganography - invisible to the eye</li>
          <li>Output image looks identical to the original</li>
          <li>Very secure - even if steganography is detected, encryption protects the message</li>
        </ul>
      </div>
    </div>
  );
};

export default SteganographyWidget;