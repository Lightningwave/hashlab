import React, { useState, useRef, useEffect } from 'react';

export const ModernSelect = ({ label, value, onChange, options, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div style={{ position: 'relative', width: '100%', ...style }} ref={dropdownRef}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: '#4a5568',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          {label}
        </label>
      )}
      
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          background: 'white',
          border: `2px solid ${isOpen ? '#667eea' : '#e2e8f0'}`,
          borderRadius: '0.5rem',
          color: '#000000',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          textAlign: 'left',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(102, 126, 234, 0.1)' : 'none'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#667eea';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        <span>{selectedOption?.label || 'Select...'}</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          style={{
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="#667eea"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 50,
            maxHeight: '300px',
            overflowY: 'auto',
            animation: 'slideIn 0.2s ease-out'
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: value === option.value ? '#f7fafc' : 'white',
                border: 'none',
                color: value === option.value ? '#667eea' : '#000000',
                fontSize: '0.875rem',
                fontWeight: value === option.value ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f1f3f5'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f7fafc';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = value === option.value ? '#f7fafc' : 'white';
                e.currentTarget.style.color = value === option.value ? '#667eea' : '#000000';
              }}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="#667eea"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernSelect;

