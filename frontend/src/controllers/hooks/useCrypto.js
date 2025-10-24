import { useState, useCallback } from 'react';
import CryptoService from '../../models/CryptoService';

/**
 * useCrypto - Controller/ViewModel for crypto operations
 * Manages state and orchestrates Model layer calls
 */
export const useCrypto = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [algorithm, setAlgorithm] = useState('md5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Hash input using MD5
   * @param {string} text 
   */
  const hashMD5 = useCallback(async (text) => {
    const textToHash = text !== undefined ? text : input;
    
    if (!textToHash && textToHash !== '') {
      setError('Please enter some text to hash');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await CryptoService.hashMD5(textToHash);
      setOutput(result);
      return result;
    } catch (err) {
      setError(err.message);
      setOutput('');
      return null;
    } finally {
      setLoading(false);
    }
  }, [input]);

  const hashGeneric = useCallback(async (algo, text) => {
    const textToHash = text !== undefined ? text : input;
    if (textToHash === null || textToHash === undefined) {
      setError('Please enter some text to hash');
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (algo) {
        case 'md5':
          result = await CryptoService.hashMD5(textToHash); break;
        case 'sha1':
          result = await CryptoService.hashSHA1(textToHash); break;
        case 'sha256':
          result = await CryptoService.hashSHA256(textToHash); break;
        case 'sha512':
          result = await CryptoService.hashSHA512(textToHash); break;
        case 'sha3-256':
          result = await CryptoService.hashSHA3_256(textToHash); break;
        case 'keccak256':
          result = await CryptoService.hashKeccak256(textToHash); break;
        case 'blake2b':
          result = await CryptoService.hashBLAKE2b(textToHash); break;
        case 'blake3':
          result = await CryptoService.hashBLAKE3(textToHash); break;
        default:
          throw new Error('Unsupported algorithm');
      }
      setOutput(result);
      return result;
    } catch (err) {
      setError(err.message);
      setOutput('');
      return null;
    } finally {
      setLoading(false);
    }
  }, [input]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setAlgorithm('md5');
  }, []);

  return {
    // State
    input,
    output,
    algorithm,
    loading,
    error,
    
    // Actions
    setInput,
    setAlgorithm,
    hashMD5,
    hashGeneric,
    reset
  };
};