import React from 'react';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import { SteganographyWidget } from '../components/SteganographyWidget';

export const SteganographyPage = () => {
  return (
    <>
      <NavBar />

      <main style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 6px 0' }}>Image Steganography</h1>
          <p style={{ color: '#555', margin: 0 }}>
            Hide encrypted messages inside PNG images using LSB technique + AES-256-GCM
          </p>
        </header>

        <section style={{ marginTop: '20px' }}>
          <SteganographyWidget />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SteganographyPage;

