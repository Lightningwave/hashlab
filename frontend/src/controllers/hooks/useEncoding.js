import { useState, useCallback } from 'react';
import EncodingService from '../../models/EncodingService';

/**
 * useEncoding - Controller for encoding/decoding tools
 */
export const useEncoding = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('base64-encode');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    if (input === null || input === undefined) {
      setError('Please enter some text');
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      let result = '';
      switch (mode) {
        case 'base64-encode': result = await EncodingService.encodeBase64(input); break;
        case 'base64-decode': result = await EncodingService.decodeBase64(input); break;
        case 'hex-encode': result = await EncodingService.encodeHex(input); break;
        case 'hex-decode': result = await EncodingService.decodeHex(input); break;
        case 'url-encode': result = await EncodingService.encodeURL(input); break;
        case 'url-decode': result = await EncodingService.decodeURL(input); break;
        case 'ascii-to-hex': result = await EncodingService.asciiToHex(input); break;
        case 'hex-to-ascii': result = await EncodingService.hexToAscii(input); break;
        default: throw new Error('Unsupported mode');
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
  }, [input, mode]);

  const reset = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setMode('base64-encode');
  }, []);

  return { input, setInput, mode, setMode, output, loading, error, run, reset };
};


