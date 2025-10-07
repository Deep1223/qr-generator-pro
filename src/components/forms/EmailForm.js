import React from 'react';

/**
 * Email input form component
 */
const EmailForm = ({ value, onChange }) => {
  const handleChange = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label fw-bold">Email Address</label>
        <input
          type="email"
          value={value.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="email@example.com"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold">Subject</label>
        <input
          type="text"
          value={value.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Email subject"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold">Message</label>
        <textarea
          value={value.body}
          onChange={(e) => handleChange('body', e.target.value)}
          placeholder="Email message"
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

export default EmailForm;
