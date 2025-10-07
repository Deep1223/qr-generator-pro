import React, { useState } from 'react';
import { Download, Copy, Check, Image, Sparkles, QrCode } from 'lucide-react';
import { downloadQRCode, copyQRCodeToClipboard } from '../utils/qrGenerator';

/**
 * QR Code preview and actions component
 */
const QRPreview = ({ 
  qrCode, 
  size, 
  errorLevel, 
  logoImage 
}) => {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    downloadQRCode(qrCode);
  };

  const handleCopy = async () => {
    const success = await copyQRCodeToClipboard(qrCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-4 shadow-lg p-4 border border-white border-opacity-20">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-2">
          <Image className="" color="#000" size={24} />
          <h2 className="h4 fw-bold text-dark mb-0">Preview</h2>
        </div>
      </div>
      
      {qrCode ? (
        <div className="text-center">
          <div className="bg-light bg-gradient p-4 rounded-4 mb-4 shadow-sm">
            <img 
              src={qrCode} 
              alt="QR Code" 
              className="img-fluid shadow-lg rounded-3"
              style={{ 
                imageRendering: 'pixelated',
                maxWidth: '100%',
                height: 'auto',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>
          
          <div className="row g-2 mb-4">
            <div className="col-6">
              <button
                onClick={handleDownload}
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 fw-semibold shadow"
                style={{
                  background: 'linear-gradient(135deg, #6f42c1, #e83e8c)',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Download size={20} />
                Download
              </button>
            </div>
            <div className="col-6">
              <button
                onClick={handleCopy}
                className="btn btn-info w-100 d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 fw-semibold shadow"
                style={{
                  background: 'linear-gradient(135deg, #17a2b8, #138496)',
                  border: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* QR Info */}
          <div className="bg-primary bg-opacity-10 p-3 rounded-3 border border-primary border-opacity-25">
            <h3 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2 justify-content-center">
              <Sparkles size={16} className="text-primary" />
              QR Code Info
            </h3>
            <div className="row g-1 text-sm">
              <div className="col-6">
                <small className="text-muted"><strong>Size:</strong> {size}x{size}px</small>
              </div>
              <div className="col-6">
                <small className="text-muted"><strong>Style:</strong> Standard</small>
              </div>
              <div className="col-6">
                <small className="text-muted"><strong>Error Level:</strong> {errorLevel}</small>
              </div>
              <div className="col-6">
                <small className="text-muted"><strong>Has Logo:</strong> {logoImage ? 'Yes' : 'No'}</small>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 text-muted">
          <div className="bg-primary bg-opacity-10 w-100 rounded-4 mb-4 d-flex align-items-center justify-content-center" style={{ height: '128px' }}>
            <QrCode size={64} className="text-primary opacity-50" />
          </div>
          <p className="fw-semibold fs-5 mb-2">No QR Code Yet</p>
          <p className="small">Fill in the content to generate</p>
        </div>
      )}
    </div>
  );
};

export default QRPreview;
