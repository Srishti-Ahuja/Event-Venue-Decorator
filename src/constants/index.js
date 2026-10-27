/**
 * Application-wide constants - single source of truth.
 */

// File Upload Validation
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_FILE_SIZE_LABEL = '10MB';

// Currency
export const CURRENCIES = [
  { code: 'USD', symbol: '$',  rate: 1    },
  { code: 'EUR', symbol: "\u20AC",  rate: 0.92 },
  { code: 'GBP', symbol: "\u00A3",  rate: 0.79 },
  { code: 'INR', symbol: "\u20B9",  rate: 85   },
];

// Pipeline Statuses
export const PIPELINE_STATUS = {
  IDLE:      'idle',
  STAGE1:    'stage1',
  STAGE2:    'stage2',
  COMPLETED: 'completed',
  ERROR:     'error',
};

// Render Modes
export const RENDER_MODE = {
  IN_PLACE: 'inPlace',
  IMAGEN3:  'imagen3',
};

// Gemini Models
export const GEMINI_MODEL = 'gemini-3.8-flash';
export const IMAGEN_MODEL  = 'imagen-3.0-generate-002';

// API Key Validation - minimum plausible length for a Google AI API key
export const MIN_API_KEY_LENGTH = 20;