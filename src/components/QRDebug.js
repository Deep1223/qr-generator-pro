import React from 'react';
import { Bug, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/**
 * Simple debug component to show QR generation status
 */
const QRDebug = ({ qrData, qrCode, isGenerating }) => {
  const getStatus = () => {
    if (isGenerating) {
      return {
        icon: <AlertTriangle className="text-warning" size={16} />,
        text: 'Generating...',
        color: 'warning'
      };
    }
    
    if (!qrData) {
      return {
        icon: <XCircle className="text-danger" size={16} />,
        text: 'No Data',
        color: 'danger'
      };
    }
    
    if (!qrCode) {
      return {
        icon: <XCircle className="text-danger" size={16} />,
        text: 'Generation Failed',
        color: 'danger'
      };
    }
    
    return {
      icon: <CheckCircle className="text-success" size={16} />,
      text: 'Ready to Scan',
      color: 'success'
    };
  };

  const status = getStatus();

  return (
    <div className={`bg-${status.color} bg-opacity-10 p-3 rounded-3 border border-${status.color} border-opacity-25 mb-3`}>
      <div className="d-flex align-items-center gap-2 mb-2">
        <Bug className="text-primary" size={18} />
        <h6 className="fw-bold text-dark mb-0">QR Generation Status</h6>
      </div>
      
      <div className="d-flex align-items-center gap-2 mb-2">
        {status.icon}
        <span className={`text-${status.color} fw-semibold`}>
          {status.text}
        </span>
      </div>
      
      <div className="row g-2 text-sm">
        <div className="col-6">
          <strong>Data:</strong> {qrData ? `${qrData.length} chars` : 'None'}
        </div>
        <div className="col-6">
          <strong>QR Code:</strong> {qrCode ? 'Generated' : 'Not Generated'}
        </div>
      </div>
      
      {qrData && (
        <div className="mt-2">
          <strong>Content Preview:</strong>
          <div className="bg-light p-2 rounded mt-1">
            <code className="small text-break">
              {qrData.length > 100 ? `${qrData.substring(0, 100)}...` : qrData}
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRDebug;
