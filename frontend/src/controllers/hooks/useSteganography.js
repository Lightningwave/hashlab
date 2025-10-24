import { useState } from 'react';
import SteganographyService from '../../models/SteganographyService';

/**
 * Custom hook for steganography operations
 */
export function useSteganography() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  /**
   * Calculate image capacity
   */
  const calculateCapacity = async (imageFile) => {
    setIsLoading(true);
    setError(null);
    try {
      const cap = await SteganographyService.calculateCapacity(imageFile);
      setCapacity(cap);
      return cap;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Encode message into image
   */
  const encodeMessage = async (imageFile, message, passphrase) => {
    setIsLoading(true);
    setError(null);
    try {
      const resultBlob = await SteganographyService.encodeMessage(
        imageFile,
        message,
        passphrase
      );
      return resultBlob;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Decode message from image
   */
  const decodeMessage = async (imageFile, passphrase) => {
    setIsLoading(true);
    setError(null);
    try {
      const message = await SteganographyService.decodeMessage(
        imageFile,
        passphrase
      );
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load image preview
   */
  const loadImagePreview = (imageFile) => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(imageFile);
  };

  /**
   * Validate image file
   */
  const validateImage = async (imageFile) => {
    setError(null);
    try {
      const isValid = await SteganographyService.validateImageFile(imageFile);
      if (!isValid) {
        setError('Invalid PNG image');
      }
      return isValid;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  /**
   * Get image dimensions
   */
  const getImageDimensions = async (imageFile) => {
    try {
      return await SteganographyService.getImageDimensions(imageFile);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Clear error
   */
  const clearError = () => setError(null);

  /**
   * Reset state
   */
  const reset = () => {
    setIsLoading(false);
    setError(null);
    setCapacity(null);
    setImagePreview(null);
  };

  return {
    isLoading,
    error,
    capacity,
    imagePreview,
    calculateCapacity,
    encodeMessage,
    decodeMessage,
    loadImagePreview,
    validateImage,
    getImageDimensions,
    clearError,
    reset,
  };
}

