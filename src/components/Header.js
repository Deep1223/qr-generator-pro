import React from 'react';
import { QrCode } from 'lucide-react';

/**
 * Modern Header component for the QR Code Generator
 */
const Header = () => {
  // minimal header - removed rotating hero features

  // No theme toggle per user's request

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between bg-white bg-opacity-95 rounded-4 shadow-lg p-3 border border-white border-opacity-20">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 rounded-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <QrCode className="text-white" size={22} />
          </div>
          <div className="fw-bold">QR Studio</div>
        </div>
        <div className="text-muted small">Fast QR creation with simple controls</div>
      </div>
    </div>
  );
};

export default Header;
