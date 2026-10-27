/**
 * Utility functions for user input sanitization, validation, and safety.
 */
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_LABEL } from '../constants/index.js';

/**
 * Strips HTML tags, dangerous URI schemes, null bytes, and prompt-injection
 * delimiters to prevent XSS and LLM prompt injection.
 * @param {string} str - Raw input
 * @param {number} [maxLength=2000] - Maximum allowed character length
 * @returns {string} Sanitized string
 */
export function sanitizeInput(str, maxLength = 2000) {
  if (typeof str !== 'string') return '';

  return str
    // Remove null bytes
    .replace(/\x00/g, '')
    // Strip HTML / SVG tags
    .replace(/<[^>]*>/g, '')
    // Strip javascript: URI scheme (case-insensitive, with optional whitespace)
    .replace(/javascript\s*:/gi, '')
    // Strip data: URI scheme (potential XSS vector)
    .replace(/data\s*:/gi, '')
    // Replace prompt-injection code fence delimiters
    .replace(/```/g, "'''")
    // Collapse excessive whitespace
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates and limits length of custom notes
 * @param {string} notes
 * @param {number} [maxLength=500]
 * @returns {string}
 */
export function sanitizeNotes(notes, maxLength = 500) {
  return sanitizeInput(notes).slice(0, maxLength);
}

/**
 * Validates an uploaded file against the strict MIME allowlist and size cap.
 * @param {File} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateFileUpload(file) {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Uploaded file is empty (0 bytes).' };
  }

  const normalizedType = (file.type || '').toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.includes(normalizedType)) {
    return {
      valid: false,
      error: `Invalid file type "${file.type || 'unknown'}". Please upload a PNG, JPEG, or WebP image.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the ${MAX_FILE_SIZE_LABEL} limit. Please upload a smaller image.`
    };
  }

  return { valid: true, error: null };
}

/**
 * Compresses an image file in the browser before state storage or API dispatch.
 * @param {File} file
 * @param {number} [maxWidth=1600]
 * @param {number} [quality=0.88]
 * @returns {Promise<{ dataUrl: string, base64: string, mimeType: string, width: number, height: number, sizeKb: number, originalName: string }>}
 */
export function processAndCompressImage(file, maxWidth = 1600, quality = 0.88) {
  return new Promise((resolve, reject) => {
    if (!file || !ALLOWED_MIME_TYPES.includes(file.type)) {
      reject(new Error('Please select a valid PNG, JPEG, or WebP image.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const base64 = dataUrl.split(',')[1];
        const sizeKb = Math.round((base64.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          base64,
          mimeType,
          width,
          height,
          sizeKb,
          originalName: file.name
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}