import React from 'react';

/**
 * Color customization component
 */
const ColorCustomization = ({ 
  fgColor, 
  bgColor, 
  gradientEnabled, 
  gradientColor2,
  onFgColorChange,
  onBgColorChange,
  onGradientToggle,
  onGradientColor2Change
}) => {
  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label fw-bold">Foreground Color</label>
        <div className="d-flex gap-2">
          <input
            type="color"
            value={fgColor}
            onChange={(e) => onFgColorChange(e.target.value)}
            className="form-control form-control-color border-2 rounded-3"
            style={{ 
              width: '64px', 
              height: '48px',
              borderColor: '#dee2e6'
            }}
          />
          <input
            type="text"
            value={fgColor}
            onChange={(e) => onFgColorChange(e.target.value)}
            className="form-control border-2 rounded-3"
            style={{ borderColor: '#dee2e6' }}
          />
        </div>
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold">Background Color</label>
        <div className="d-flex gap-2">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
            className="form-control form-control-color border-2 rounded-3"
            style={{ 
              width: '64px', 
              height: '48px',
              borderColor: '#dee2e6'
            }}
          />
          <input
            type="text"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
            className="form-control border-2 rounded-3"
            style={{ borderColor: '#dee2e6' }}
          />
        </div>
      </div>
      
      <div className="col-12">
        <div className="form-check">
          <input
            type="checkbox"
            checked={gradientEnabled}
            onChange={(e) => onGradientToggle(e.target.checked)}
            className="form-check-input"
            id="gradientCheck"
          />
          <label className="form-check-label fw-bold" htmlFor="gradientCheck">
            Enable Gradient
          </label>
        </div>
        
        {gradientEnabled && (
          <div className="mt-3">
            <label className="form-label fw-bold">Gradient Color 2</label>
            <div className="d-flex gap-2">
              <input
                type="color"
                value={gradientColor2}
                onChange={(e) => onGradientColor2Change(e.target.value)}
                className="form-control form-control-color border-2 rounded-3"
                style={{ 
                  width: '64px', 
                  height: '48px',
                  borderColor: '#dee2e6'
                }}
              />
              <input
                type="text"
                value={gradientColor2}
                onChange={(e) => onGradientColor2Change(e.target.value)}
                className="form-control border-2 rounded-3"
                style={{ borderColor: '#dee2e6' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorCustomization;
