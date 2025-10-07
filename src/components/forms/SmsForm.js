import React from 'react';

/**
 * SMS input form component
 */
const SmsForm = ({ value, onChange }) => {
  const handleChange = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label fw-bold">Phone Number</label>
        <input
          type="tel"
          value={value.number}
          onChange={(e) => handleChange('number', e.target.value)}
          placeholder="+1 (234) 567-8900"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold">Message</label>
        <textarea
          value={value.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="SMS message"
          className="form-control form-control-lg border-2 rounded-3"
          rows="4"
          style={{
            resize: 'none',
            borderColor: '#dee2e6'
          }}
        />
      </div>
    </div>
  );
};

export default SmsForm;
