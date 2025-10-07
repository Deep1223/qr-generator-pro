import React from 'react';

/**
 * WiFi input form component
 */
const WifiForm = ({ value, onChange }) => {
  const handleChange = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label fw-bold">Network Name (SSID)</label>
        <input
          type="text"
          value={value.ssid}
          onChange={(e) => handleChange('ssid', e.target.value)}
          placeholder="MyWiFiNetwork"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold">Password</label>
        <input
          type="text"
          value={value.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="WiFi Password"
          className="form-control form-control-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold">Encryption Type</label>
        <select
          value={value.encryption}
          onChange={(e) => handleChange('encryption', e.target.value)}
          className="form-select form-select-lg border-2 rounded-3"
          style={{ borderColor: '#dee2e6' }}
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (Open)</option>
        </select>
      </div>
    </div>
  );
};

export default WifiForm;
