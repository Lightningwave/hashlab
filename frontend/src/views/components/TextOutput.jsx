import React, { useState } from 'react';

/**
 * TextOutput - Presentational component for displaying output with copy functionality
 */
export const TextOutput = ({ value, label = "Output" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="output-group" style={{ marginTop: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px',
        fontWeight: '500',
        color: '#333'
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value}
          readOnly
          style={{
            width: '100%',
            padding: '12px',
            paddingRight: '100px',
            fontSize: '14px',
            fontFamily: 'monospace',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            color: '#495057',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            backgroundColor: copied ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            transition: 'background-color 0.2s'
          }}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};