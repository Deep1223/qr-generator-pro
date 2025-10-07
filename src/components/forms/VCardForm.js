import React from 'react';

/**
 * vCard input form component
 */
const VCardForm = ({ value, onChange }) => {
  const handleChange = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label fw-bold">Full Name</label>
        <input
          type="text"
          value={value.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold">Phone</label>
        <input
          type="tel"
          value={value.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1234567890"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold">Email</label>
        <input
          type="email"
          value={value.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold">Company</label>
        <input
          type="text"
          value={value.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Acme Inc."
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold">Website</label>
        <input
          type="url"
          value={value.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://example.com"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
    </div>
  );
};

export default VCardForm;
