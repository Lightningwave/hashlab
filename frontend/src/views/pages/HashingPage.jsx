import React from 'react';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useCrypto } from '../../controllers/hooks/useCrypto';
import { HashingWidget } from '../components/HashingWidget';

export const HashingPage = () => {
  const { input, setInput, algorithm, setAlgorithm, loading, error, output, hashGeneric } = useCrypto();

  return (
    <>
      <NavBar />

      <main style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 6px 0' }}>Hashing</h1>
          <p style={{ color: '#555', margin: 0 }}>Client-side hashing utilities powered by WebAssembly</p>
        </header>

        <section style={{ marginTop: '20px' }}>
          <HashingWidget
            input={input}
            setInput={setInput}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            loading={loading}
            error={error}
            output={output}
            onHash={hashGeneric}
          />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HashingPage;


