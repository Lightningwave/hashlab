import React from 'react';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useEncoding } from '../../controllers/hooks/useEncoding';
import { EncodingWidget } from '../components/EncodingWidget';

export const EncodingPage = () => {
  return (
    <>
      <NavBar />
      <main style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
        <h1 style={{ marginTop: 0 }}>Encoding</h1>
        <p style={{ color: '#555' }}>
          Run text encoders and decoders directly in your browser.
        </p>
        <section style={{ marginTop: '20px' }}>
          <EncodingSection />
        </section>
      </main>
      <Footer />
    </>
  );
};

const EncodingSection = () => {
  const { input, setInput, mode, setMode, output, loading, error, run } = useEncoding();
  return (
    <EncodingWidget
      input={input}
      setInput={setInput}
      mode={mode}
      setMode={setMode}
      loading={loading}
      error={error}
      output={output}
      onRun={run}
    />
  );
};

export default EncodingPage;


