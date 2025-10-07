import React from 'react';

/**
 * Phone input form component
 */
const PhoneForm = ({ value, onChange }) => {
  return (
    <div>
      <label className="form-label fw-bold">Phone Number</label>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="+1 (234) 567-8900"
        className="form-control form-control-lg border-2 rounded-3"
        style={{ borderColor: '#dee2e6' }}
      />
    </div>
  );
};

export default PhoneForm;
