import React from 'react';

/**
 * Color presets component
 */
const ColorPresets = ({ onPresetSelect }) => {
  const presetColors = [
    { fg: '#000000', bg: '#ffffff', name: 'Classic' },
    { fg: '#ffffff', bg: '#000000', name: 'Inverted' },
    { fg: '#6366f1', bg: '#f0f9ff', name: 'Ocean' },
    { fg: '#ec4899', bg: '#fdf2f8', name: 'Pink' },
    { fg: '#10b981', bg: '#f0fdf4', name: 'Green' },
    { fg: '#f59e0b', bg: '#fffbeb', name: 'Gold' },
  ];

  return (
    <div>
      <label className="form-label fw-bold mb-3">Color Presets</label>
      <div className="row g-2">
        {presetColors.map((preset, idx) => (
          <div key={idx} className="col-4 col-lg-2">
            <button
              onClick={() => onPresetSelect(preset)}
              className="btn btn-outline-secondary w-100 d-flex flex-column align-items-center gap-2 p-2 rounded-3 border-2"
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.borderColor = '#6f42c1';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = '#dee2e6';
              }}
            >
              <div className="d-flex gap-1">
                <div 
                  className="rounded-3 shadow-sm"
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: preset.fg 
                  }}
                />
                <div 
                  className="rounded-3 shadow-sm"
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: preset.bg 
                  }}
                />
              </div>
              <span className="small fw-semibold text-dark">{preset.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPresets;
