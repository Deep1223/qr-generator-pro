import React, { useEffect } from 'react';
import { formatUrlForQR, isValidUrl } from '../../utils/urlUtils';

/**
 * URL input form component
 */
const UrlForm = ({ value, onChange }) => {
  useEffect(() => {
    // Auto-format URL when component mounts if value exists
    if (value && !isValidUrl(value)) {
      const formatted = formatUrlForQR(value);
      if (formatted !== value) {
        onChange(formatted);
      }
    }
  }, [value, onChange]);

  const handleChange = (newValue) => {
    // Auto-format URL as user types
    const formatted = formatUrlForQR(newValue);
    onChange(formatted);
  };

  return (
    <div>
      <label className="form-label fw-bold">Website URL</label>
      <input
        type="url"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="https://example.com"
        className="form-control form-control-lg border-2 rounded-3"
        style={{ borderColor: '#dee2e6' }}
      />
    </div>
  );
};

export default UrlForm;
