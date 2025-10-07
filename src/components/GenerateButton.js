import React from 'react';
import { QrCode, Loader } from 'lucide-react';

/**
 * Generate button component for QR code generation
 */
const GenerateButton = ({ 
  onGenerate, 
  isGenerating = false, 
  disabled = false,
  qrData = '',
  className = ''
}) => {
  const handleClick = () => {
    if (!disabled && !isGenerating && qrData.trim()) {
      onGenerate();
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <button
        onClick={handleClick}
        disabled={disabled || isGenerating || !qrData.trim()}
        className={`btn btn-lg px-5 py-3 rounded-4 fw-bold text-white border-0 shadow-lg btn-modern position-relative overflow-hidden ${
          disabled || isGenerating || !qrData.trim()
            ? 'opacity-50'
            : ''
        }`}
        style={{
          background: disabled || isGenerating || !qrData.trim() 
            ? 'linear-gradient(135deg, #6c757d, #495057)' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minWidth: '250px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.2)'
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isGenerating && qrData.trim()) {
            e.target.style.transform = 'translateY(-3px) scale(1.02)';
            e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isGenerating && qrData.trim()) {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }
        }}
      >
        {isGenerating ? (
          <>
            <Loader className="animate-spin me-2" size={20} />
            <span className="animate-pulse">Generating Magic...</span>
          </>
        ) : (
          <>
            <QrCode className="me-2 animate-bounce" size={20} />
            <span>✨ Generate QR Code</span>
          </>
        )}
      </button>
      
      {qrData.trim() && !isGenerating && (
        <div className="mt-2">
          <small className="text-success">
            ✅ Ready to generate QR code ({qrData.length} characters)
          </small>
        </div>
      )}
    </div>
  );
};

export default GenerateButton;
