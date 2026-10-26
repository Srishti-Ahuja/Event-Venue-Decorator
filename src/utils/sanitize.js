/**
 * Utility functions for user input sanitization and safety
 */

/**
 * Strips HTML tags and script-like elements to prevent XSS.
 * @param {string} str - Raw input
 * @returns {string} Sanitized string
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  
  return str
    // Replace html tags
    .replace(/<[^>]*>/g, '')
    // Replace dangerous prompt injection keywords or delimiters
    .replace(/```/g, "'''")
    // Normalize excessive whitespaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validates and limits length of custom notes
 * @param {string} notes
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeNotes(notes, maxLength = 500) {
  const cleaned = sanitizeInput(notes);
  return cleaned.slice(0, maxLength);
}

/**
 * Compresses an image file in the browser before state storage or API dispatch
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} quality 
 * @returns {Promise<{ dataUrl: string, base64: string, mimeType: string, width: number, height: number, sizeKb: number }>}
 */
export function processAndCompressImage(file, maxWidth = 1600, quality = 0.88) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid PNG or JPEG image.'));
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
