import React from 'react';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { useEncryption } from '../../controllers/hooks/useEncryption';
import { EncryptionWidget } from '../components/EncryptionWidget';

export const EncryptionPage = () => {
  return (
    <>
      <NavBar />
      <main style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
        <h1 style={{ marginTop: 0 }}>Encryption</h1>
        <p style={{ color: '#555' }}>
          AES-CBC encryption/decryption runs locally in your browser. 
        </p>
        <section style={{ marginTop: '20px' }}>
          <EncryptionSection />
        </section>
      </main>
      <Footer />
    </>
  );
};

const EncryptionSection = () => {
  const {
    algorithm, setAlgorithm,
    cipherMode, setCipherMode,
    keySize, setKeySize,
    plaintext, setPlaintext,
    cipherBase64, setCipherBase64,
    passphrase, setPassphrase,
    output, loading, error, message,
    encrypt, decrypt
  } = useEncryption();

  return (
    <EncryptionWidget
      algorithm={algorithm}
      setAlgorithm={setAlgorithm}
      cipherMode={cipherMode}
      setCipherMode={setCipherMode}
      keySize={keySize}
      setKeySize={setKeySize}
      plaintext={plaintext}
      setPlaintext={setPlaintext}
      cipherBase64={cipherBase64}
      setCipherBase64={setCipherBase64}
      passphrase={passphrase}
      setPassphrase={setPassphrase}
      output={output}
      loading={loading}
      error={error}
      message={message}
      onEncrypt={encrypt}
      onDecrypt={decrypt}
    />
  );
};

export default EncryptionPage;


