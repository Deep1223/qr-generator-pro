/**
 * URL utility functions for QR code generation
 */

/**
 * Detects if a string is a valid URL
 * @param {string} str - String to check
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Auto-detects content type based on input
 * @param {string} input - Input string
 * @returns {string} - Detected content type
 */
export const detectContentType = (input) => {
  if (!input) return 'text';
  
  const trimmedInput = input.trim();
  
  // Check for URLs
  if (isValidUrl(trimmedInput)) {
    return 'url';
  }
  
  // Check for email
  if (trimmedInput.includes('@') && trimmedInput.includes('.')) {
    return 'email';
  }
  
  // Check for phone number (basic pattern)
  if (/^[\+]?[\d\s\-\(\)]{10,}$/.test(trimmedInput.replace(/\s/g, ''))) {
    return 'phone';
  }
  
  // Check for WiFi format
  if (trimmedInput.toLowerCase().includes('wifi') || trimmedInput.toLowerCase().includes('ssid')) {
    return 'wifi';
  }
  
  // Default to text
  return 'text';
};

/**
 * Normalizes URL by adding protocol if missing
 * @param {string} url - URL to normalize
 * @returns {string} - Normalized URL
 */
export const normalizeUrl = (url) => {
  if (!url) return '';
  
  const trimmedUrl = url.trim();
  
  // If already has protocol, return as is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  
  // Add https:// by default
  return `https://${trimmedUrl}`;
};

/**
 * Formats URL for QR code generation
 * @param {string} url - URL to format
 * @returns {string} - Formatted URL
 */
export const formatUrlForQR = (url) => {
  const normalized = normalizeUrl(url);
  
  // Ensure it's a valid URL
  if (!isValidUrl(normalized)) {
    return url; // Return original if can't normalize
  }
  
  return normalized;
};
