import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid #e2e8f0',
      background: '#f8f9fa',
      color: '#4a5568'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem 2rem',
        flexWrap: 'wrap',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontWeight: 600, color: '#000000' }}>HashLab</span>
          <span style={{ fontSize: '0.875rem' }}>© 2025</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <span style={{ 
            padding: '0.25rem 0.75rem', 
            background: 'rgba(67, 233, 123, 0.1)',
            borderRadius: '9999px',
            color: '#43e97b',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
             Client-Side Only
          </span>
          <span>No data ever leaves your browser</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


