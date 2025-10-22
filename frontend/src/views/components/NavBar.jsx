import React from 'react';
import { Link, navigate } from '../../router/Router';

export const NavBar = () => {
  const [active, setActive] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handleNavigation = () => setActive(window.location.pathname);
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const navItems = [
    { label: 'Encryption', href: '/encryption' },
    { label: 'Hashing', href: '/hashing' },
    { label: 'Encoding', href: '/encoding' }
  ];

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div 
        onClick={() => navigate('/')} 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.1rem',
          padding: '0.5rem 1rem',
          borderRadius: '0.75rem',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img 
          src="/images/hashlab-nobg.png" 
          alt="HashLab Logo" 
          style={{ 
            height: '48px', 
            width: 'auto'
          }} 
        />
        <span style={{
          fontWeight: 700,
          fontSize: '1.25rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          HashLab
        </span>
      </div>

      <ul style={{
        display: 'flex',
        gap: '0.5rem',
        listStyle: 'none',
        margin: 0,
        padding: 0
      }}>
        {navItems.map(item => {
          const isActive = active === item.href;
          return (
            <li key={item.label}>
              <Link
                to={item.href}
                onClick={() => setActive(item.href)}
                style={{
                  textDecoration: 'none',
                  color: isActive ? '#667eea' : '#4a5568',
                  padding: '0.625rem 1rem',
                  borderRadius: '0.5rem',
                  background: isActive 
                    ? '#f7fafc' 
                    : 'transparent',
                  border: isActive 
                    ? '1px solid #667eea' 
                    : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f7fafc';
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.borderColor = '#e0e7ff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#4a5568';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;


