import React, { useState, useEffect } from 'react';
import { History, Trash2, Copy, Download, Eye } from 'lucide-react';

/**
 * QR Code History component to show recently generated QR codes
 */
const QRHistory = ({ qrCode, qrData, onQRSelect, trigger }) => {
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('qrHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading QR history:', error);
      }
    }
  }, []);

  // Save QR code to history when new QR is generated
  useEffect(() => {
    if (qrCode && qrData && qrData.trim()) {
      const newEntry = {
        id: Date.now(),
        qrCode,
        qrData: qrData.substring(0, 50) + (qrData.length > 50 ? '...' : ''),
        fullData: qrData,
        timestamp: new Date().toLocaleString(),
        type: getQRType(qrData)
      };

      setHistory(prev => {
        // Remove duplicates and keep only last 10
        const filtered = prev.filter(item => item.fullData !== qrData);
        const newHistory = [newEntry, ...filtered].slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('qrHistory', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [trigger, qrCode, qrData]);

  const getQRType = (data) => {
    if (data.startsWith('http')) return 'URL';
    if (data.startsWith('mailto:')) return 'Email';
    if (data.startsWith('tel:')) return 'Phone';
    if (data.startsWith('sms:')) return 'SMS';
    if (data.startsWith('WIFI:')) return 'WiFi';
    if (data.startsWith('BEGIN:VCARD')) return 'vCard';
    return 'Text';
  };

  const deleteHistoryItem = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('qrHistory', JSON.stringify(newHistory));
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('qrHistory');
  };

  const copyQRData = async (data) => {
    try {
      await navigator.clipboard.writeText(data);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadQR = (qrCodeDataURL, timestamp) => {
    try {
      const link = document.createElement('a');
      link.download = `qrcode-${timestamp.replace(/[^\w\s]/gi, '')}.png`;
      link.href = qrCodeDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="glass rounded-4 shadow-lg p-4 mb-4 card-hover">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-light p-2 rounded-3">
            <History color="#000" size={20} />
          </div>
          <h3 className="h5 fw-bold text-dark mb-0">Recent QR Codes</h3>
          <span className="badge bg-white bg-opacity-20 text-white">
            {history.length}
          </span>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn btn-sm btn-outline-light rounded-3"
          >
            <Eye size={16} />
            {showHistory ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={clearAllHistory}
            className="btn btn-sm btn-outline-danger rounded-3"
            title="Clear all history"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="row g-3">
          {history.map((item, index) => (
            <div key={item.id} className="col-6 col-md-4 col-lg-3 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-white bg-opacity-95 rounded-4 p-3 border border-white border-opacity-20 hover-card">
                <div className="text-center mb-3">
                  <img 
                    src={item.qrCode} 
                    alt="QR Code" 
                    className="img-fluid rounded-3 shadow-sm"
                    style={{ maxWidth: '80px', cursor: 'pointer' }}
                    onClick={() => onQRSelect(item.fullData)}
                    title="Click to use this QR data"
                  />
                </div>
                
                <div className="text-center">
                  <div className="badge bg-light text-dark mb-2 small">
                    {item.type}
                  </div>
                  <p className="text-muted small mb-2 text-truncate" title={item.qrData}>
                    {item.qrData}
                  </p>
                  <p className="text-muted x-small mb-3">
                    {item.timestamp}
                  </p>
                  
                  <div className="d-flex gap-1 justify-content-center">
                    <button
                      onClick={() => copyQRData(item.fullData)}
                      className="btn btn-sm btn-outline-secondary rounded-3"
                      title="Copy data"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={() => downloadQR(item.qrCode, item.timestamp)}
                      className="btn btn-sm btn-outline-secondary rounded-3"
                      title="Download"
                    >
                      <Download size={12} />
                    </button>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="btn btn-sm btn-outline-danger rounded-3"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QRHistory;
