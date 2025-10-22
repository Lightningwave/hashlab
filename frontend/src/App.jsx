import React from 'react';
import { HashingPage } from './views/pages/HashingPage';
import { EncryptionPage } from './views/pages/EncryptionPage';
import { EncodingPage } from './views/pages/EncodingPage';
import { Router } from './router/Router';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Router
        routes={[
          { path: '/', element: EncryptionPage },
          { path: '/hashing', element: HashingPage },
          { path: '/encryption', element: EncryptionPage },
          { path: '/encoding', element: EncodingPage }
        ]}
      />
    </div>
  );
}

export default App;