import React from 'react';

/**
 * TextInput - Presentational component for text input
 */
export const TextInput = ({ value, onChange, placeholder, disabled, label = "Input Text" }) => {
  return (
    <div className="input-group">
      <label style={{ 
        display: 'block', 
        marginBottom: '8px',
        fontWeight: '500',
        color: '#333'
      }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={6}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '14px',
          fontFamily: 'monospace',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          resize: 'vertical',
          backgroundColor: disabled ? '#f5f5f5' : 'white',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => e.target.style.borderColor = '#007bff'}
        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
      />
    </div>
  );
};