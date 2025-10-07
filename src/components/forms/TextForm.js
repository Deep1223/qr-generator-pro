import React from 'react';

/**
 * Text input form component
 */
const TextForm = ({ value, onChange }) => {
  return (
    <div>
      <label className="form-label fw-bold">Text Content</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter any text..."
        className="form-control form-control-lg border-2 rounded-3"
        rows="6"
        style={{
          resize: 'none',
          borderColor: '#dee2e6'
        }}
      />
    </div>
  );
};

export default TextForm;
