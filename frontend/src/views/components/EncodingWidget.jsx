import React from 'react';
import { TextInput } from './TextInput';
import { TextOutput } from './TextOutput';
import { ModernSelect } from './ModernSelect';

export const EncodingWidget = ({ input, setInput, mode, setMode, loading, error, output, onRun }) => {
  const modeOptions = [
    { value: 'base64-encode', label: 'Base64 Encode' },
    { value: 'base64-decode', label: 'Base64 Decode' },
    { value: 'hex-encode', label: 'Hex Encode' },
    { value: 'hex-decode', label: 'Hex Decode' },
    { value: 'url-encode', label: 'URL Encode' },
    { value: 'url-decode', label: 'URL Decode' },
    { value: 'ascii-to-hex', label: 'ASCII → Hex' },
    { value: 'hex-to-ascii', label: 'Hex → ASCII' }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '16px', maxWidth: '350px' }}>
        <ModernSelect
          label="Encoding Operation"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          options={modeOptions}
        />
      </div>

      <TextInput
        value={input}
        onChange={setInput}
        placeholder="Enter text..."
        disabled={loading}
        label="Input"
      />

      <div style={{ margin: '20px 0' }}>
        <button
          onClick={onRun}
          disabled={loading || !input}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: (loading || !input) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (loading || !input) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Working...' : 'Run'}
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
        <TextOutput value={output} label="Output" />
      )}
    </div>
  );
};

export default EncodingWidget;


