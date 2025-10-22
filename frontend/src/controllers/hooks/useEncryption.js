import { useState, useCallback } from 'react';
import EncryptionService from '../../models/EncryptionService';

function base64ToBytes(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export const useEncryption = () => {
  const [algorithm, setAlgorithm] = useState('aes');
  const [cipherMode, setCipherMode] = useState('cbc');
  const [keySize, setKeySize] = useState('128');
  const [plaintext, setPlaintext] = useState('');
  const [cipherBase64, setCipherBase64] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Auto-adjust key size when algorithm changes
  const handleAlgorithmChange = useCallback((newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    if (newAlgorithm === 'aes') {
      setKeySize('128');
    } else if (newAlgorithm === 'des') {
      setKeySize('56');
    } else if (newAlgorithm === '3des') {
      setKeySize('168');
    } else if (newAlgorithm === 'rc4') {
      setKeySize('128');
    } else if (newAlgorithm === 'chacha20') {
      setKeySize('256');
    }
  }, []);

  const encrypt = useCallback(async () => {
    setLoading(true); setError(null); setMessage('');
    try {
      if (algorithm === 'aes') {
        if (cipherMode === 'cbc') {
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const result = keySize === '128' 
            ? await EncryptionService.aes128EncryptAutoIv(plaintext, passphrase, salt)
            : keySize === '192'
            ? await EncryptionService.aes192EncryptAutoIv(plaintext, passphrase, salt)
            : await EncryptionService.aes256EncryptAutoIv(plaintext, passphrase, salt);
          setCipherBase64(result); 
          setOutput(result);
          setMessage(`AES-${keySize}-CBC encryption successful. Salt and IV automatically included.`);
        } else if (cipherMode === 'ecb') {
          const result = keySize === '128' 
            ? await EncryptionService.aes128EcbEncrypt(plaintext, passphrase)
            : keySize === '192'
            ? await EncryptionService.aes192EcbEncrypt(plaintext, passphrase)
            : await EncryptionService.aes256EcbEncrypt(plaintext, passphrase);
          setCipherBase64(result); setOutput(result);
          setMessage(`AES-${keySize}-ECB encryption successful.`);
        } else if (cipherMode === 'ctr') {
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const result = keySize === '128' 
            ? await EncryptionService.aes128CtrEncrypt(plaintext, passphrase, salt)
            : keySize === '192'
            ? await EncryptionService.aes192CtrEncrypt(plaintext, passphrase, salt)
            : await EncryptionService.aes256CtrEncrypt(plaintext, passphrase, salt);
          setCipherBase64(result); 
          setOutput(result);
          setMessage(`AES-${keySize}-CTR encryption successful. Salt and nonce automatically included.`);
        }
      } else if (algorithm === 'des') {
        if (cipherMode === 'cbc') {
          const result = await EncryptionService.desEncryptAutoIv(plaintext, passphrase);
          setCipherBase64(result); setOutput(result);
          setMessage('DES-CBC encryption successful. IV automatically included.');
        } else if (cipherMode === 'ecb') {
          const result = await EncryptionService.desEcbEncrypt(plaintext, passphrase);
          setCipherBase64(result); setOutput(result);
          setMessage('DES-ECB encryption successful.');
        } else if (cipherMode === 'ctr') {
          const result = await EncryptionService.desCtrEncrypt(plaintext, passphrase);
          setCipherBase64(result); setOutput(result);
          setMessage('DES-CTR encryption successful. Nonce automatically included.');
        }
      } else if (algorithm === '3des') {
        if (cipherMode === 'cbc') {
          const result = await EncryptionService.tdesEncryptAutoIv(plaintext, passphrase, true);
          setCipherBase64(result); setOutput(result);
          setMessage('Triple DES-CBC encryption successful. IV automatically included.');
        } else if (cipherMode === 'ecb') {
          const result = await EncryptionService.tdesEcbEncrypt(plaintext, passphrase, true);
          setCipherBase64(result); setOutput(result);
          setMessage('Triple DES-ECB encryption successful.');
        } else if (cipherMode === 'ctr') {
          const result = await EncryptionService.tdesCtrEncrypt(plaintext, passphrase, true);
          setCipherBase64(result); setOutput(result);
          setMessage('Triple DES-CTR encryption successful. Nonce automatically included.');
        }
      } else if (algorithm === 'rc4') {
        const result = await EncryptionService.rc4Encrypt(plaintext, passphrase);
        setCipherBase64(result); setOutput(result);
        setMessage('RC4 encryption complete. WARNING: RC4 is insecure and deprecated.');
      } else if (algorithm === 'chacha20') {
        const result = await EncryptionService.chacha20Encrypt(plaintext, passphrase);
        setCipherBase64(result); setOutput(result);
        setMessage('ChaCha20 encryption successful. Nonce automatically included.');
      }
    } catch (e) { 
      console.error('Encryption error:', e);
      const errorMsg = e.message || e.toString() || 'Encryption failed';
      setError(errorMsg); 
      setOutput(''); 
      setMessage(''); 
    }
    finally { setLoading(false); }
  }, [algorithm, cipherMode, keySize, plaintext, passphrase]);

  const decrypt = useCallback(async () => {
    setLoading(true); setError(null); setMessage('');
    try {
      if (algorithm === 'aes') {
        if (cipherMode === 'cbc') {
          const text = keySize === '128'
            ? await EncryptionService.aes128DecryptAutoIv(cipherBase64, passphrase)
            : keySize === '192'
            ? await EncryptionService.aes192DecryptAutoIv(cipherBase64, passphrase)
            : await EncryptionService.aes256DecryptAutoIv(cipherBase64, passphrase);
          setOutput(text);
          setMessage(`AES-${keySize}-CBC decryption successful. Salt and IV automatically extracted.`);
        } else if (cipherMode === 'ecb') {
          const text = keySize === '128'
            ? await EncryptionService.aes128EcbDecrypt(cipherBase64, passphrase)
            : keySize === '192'
            ? await EncryptionService.aes192EcbDecrypt(cipherBase64, passphrase)
            : await EncryptionService.aes256EcbDecrypt(cipherBase64, passphrase);
          setOutput(text);
          setMessage(`AES-${keySize}-ECB decryption successful.`);
        } else if (cipherMode === 'ctr') {
          const text = keySize === '128'
            ? await EncryptionService.aes128CtrDecrypt(cipherBase64, passphrase)
            : keySize === '192'
            ? await EncryptionService.aes192CtrDecrypt(cipherBase64, passphrase)
            : await EncryptionService.aes256CtrDecrypt(cipherBase64, passphrase);
          setOutput(text);
          setMessage(`AES-${keySize}-CTR decryption successful. Salt and nonce automatically extracted.`);
        }
      } else if (algorithm === 'des') {
        if (cipherMode === 'cbc') {
          const text = await EncryptionService.desDecryptAutoIv(cipherBase64, passphrase);
          setOutput(text);
          setMessage('DES-CBC decryption successful. IV automatically extracted.');
        } else if (cipherMode === 'ecb') {
          const text = await EncryptionService.desEcbDecrypt(cipherBase64, passphrase);
          setOutput(text);
          setMessage('DES-ECB decryption successful.');
        } else if (cipherMode === 'ctr') {
          const text = await EncryptionService.desCtrDecrypt(cipherBase64, passphrase);
          setOutput(text);
          setMessage('DES-CTR decryption successful. Nonce automatically extracted.');
        }
      } else if (algorithm === '3des') {
        if (cipherMode === 'cbc') {
          const text = await EncryptionService.tdesDecryptAutoIv(cipherBase64, passphrase, true);
          setOutput(text);
          setMessage('Triple DES-CBC decryption successful. IV automatically extracted.');
        } else if (cipherMode === 'ecb') {
          const text = await EncryptionService.tdesEcbDecrypt(cipherBase64, passphrase, true);
          setOutput(text);
          setMessage('Triple DES-ECB decryption successful.');
        } else if (cipherMode === 'ctr') {
          const text = await EncryptionService.tdesCtrDecrypt(cipherBase64, passphrase, true);
          setOutput(text);
          setMessage('Triple DES-CTR decryption successful. Nonce automatically extracted.');
        }
      } else if (algorithm === 'rc4') {
        const text = await EncryptionService.rc4Decrypt(cipherBase64, passphrase);
        setOutput(text);
        setMessage('RC4 decryption complete. Remember: RC4 is insecure.');
      } else if (algorithm === 'chacha20') {
        const text = await EncryptionService.chacha20Decrypt(cipherBase64, passphrase);
        setOutput(text);
        setMessage('ChaCha20 decryption successful. Nonce automatically extracted.');
      }
    } catch (e) { 
      console.error('Decryption error:', e);
      let errorMsg = e.message || e.toString() || 'Unknown error occurred';
      
      if (errorMsg.includes('decrypt error') || errorMsg.includes('padding') || errorMsg.includes('BadPadding')) {
        errorMsg = 'Decryption failed. This usually means:\n• Wrong passphrase\n• Wrong algorithm/mode/key size\n• Corrupted ciphertext';
      } else if (errorMsg.includes('too short')) {
        errorMsg = 'Invalid ciphertext: Data is too short or corrupted';
      } else if (errorMsg.includes('base64') || errorMsg.includes('Invalid')) {
        errorMsg = 'Invalid ciphertext format. Make sure you copied the complete encrypted text.';
      }
      
      setError(errorMsg); 
      setOutput(''); 
      setMessage(''); 
    }
    finally { setLoading(false); }
  }, [algorithm, cipherMode, keySize, cipherBase64, passphrase]);

  const reset = useCallback(() => {
    setPlaintext(''); setCipherBase64(''); setPassphrase(''); setOutput(''); setError(null); setMessage('');
  }, []);

  return {
    algorithm, setAlgorithm: handleAlgorithmChange,
    cipherMode, setCipherMode,
    keySize, setKeySize,
    plaintext, setPlaintext,
    cipherBase64, setCipherBase64,
    passphrase, setPassphrase,
    output, loading, error, message,
    encrypt, decrypt, reset
  };
};


