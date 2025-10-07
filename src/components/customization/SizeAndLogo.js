import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

/**
 * Size and logo customization component
 */
const SizeAndLogo = ({ 
  size, 
  onSizeChange, 
  logoImage, 
  logoSize, 
  onLogoSizeChange,
  onLogoUpload,
  onLogoRemove
}) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onLogoUpload(file);
    }
  };

  return (
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label fw-bold">
          Size: {size}px
        </label>
        <input
          type="range"
          min="200"
          max="800"
          step="50"
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="form-range"
          style={{ accentColor: '#6f42c1' }}
        />
      </div>
      
      <div className="col-12">
        <label className="form-label fw-bold">Logo (Center)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="d-none"
        />
        <div className="d-flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #007bff, #0056b3)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontWeight: '600'
            }}
          >
            <Upload size={20} />
            {logoImage ? 'Change Logo' : 'Upload Logo'}
          </button>
          {logoImage && (
            <button
              onClick={onLogoRemove}
              className="btn btn-danger"
              style={{
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '600'
              }}
            >
              Remove
            </button>
          )}
        </div>
        
        {logoImage && (
          <div className="mt-3">
            <label className="form-label fw-bold">
              Logo Size: {logoSize}%
            </label>
            <input
              type="range"
              min="10"
              max="40"
              step="5"
              value={logoSize}
              onChange={(e) => onLogoSizeChange(Number(e.target.value))}
              className="form-range"
              style={{ accentColor: '#6f42c1' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeAndLogo;
