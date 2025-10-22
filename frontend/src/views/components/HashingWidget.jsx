import React from 'react';
import { TextInput } from './TextInput';
import { TextOutput } from './TextOutput';
import { ModernSelect } from './ModernSelect';

export const HashingWidget = ({ input, setInput, algorithm, setAlgorithm, loading, error, output, onHash }) => {
  const algorithmOptions = [
    { value: 'md5', label: 'MD5 (128-bit)' },
    { value: 'sha1', label: 'SHA-1 (160-bit)' },
    { value: 'sha256', label: 'SHA-256 (256-bit)' },
    { value: 'sha512', label: 'SHA-512 (512-bit)' },
    { value: 'sha3-256', label: 'SHA3-256 (256-bit)' },
    { value: 'keccak256', label: 'Keccak-256 (Ethereum)' },
    { value: 'blake2b', label: 'BLAKE2b (512-bit)' },
    { value: 'blake3', label: 'BLAKE3 (256-bit)' }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '16px', maxWidth: '300px' }}>
        <ModernSelect
          label="Hash Algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          options={algorithmOptions}
        />
      </div>

      <TextInput
        value={input}
        onChange={setInput}
        placeholder={`Enter text to hash with ${algorithm.toUpperCase()}...`}
        disabled={loading}
        label="Input Text"
      />

      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onHash(algorithm)}
          disabled={loading || !input}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: (loading || !input) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (loading || !input) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!loading && input) e.target.style.backgroundColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            if (!loading && input) e.target.style.backgroundColor = '#007bff';
          }}
        >
          {loading ? 'Hashing...' : 'Generate Hash'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {output && (
        <TextOutput
          value={output}
          label={`${algorithm.toUpperCase()} Hash`}
        />
      )}
    </div>
  );
};

export default HashingWidget;


