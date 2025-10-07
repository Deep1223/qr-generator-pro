import React, { useState } from 'react';
import { Check, Copy, ExternalLink, XCircle } from 'lucide-react';

const ScanResult = ({ value, onDismiss }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  };

  const handleOpen = () => {
    try {
      const isUrl = /^https?:\/\//i.test(value);
      if (isUrl) {
        window.open(value, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {}
  };

  return (
    <div className="bg-success bg-opacity-10 border border-success border-opacity-25 rounded-4 p-3 d-flex align-items-start gap-3">
      <div className="flex-grow-1">
        <div className="d-flex align-items-center gap-2 mb-2">
          <Check size={18} className="text-success" />
          <strong>Scanned content</strong>
        </div>
        <div className="text-break small text-dark" style={{ wordBreak: 'break-word' }}>{value}</div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button onClick={handleCopy} className="btn btn-sm btn-outline-success rounded-3 d-flex align-items-center gap-1">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        {/\^https?:\/\//i.test(value) && (
          <button onClick={handleOpen} className="btn btn-sm btn-success rounded-3 d-flex align-items-center gap-1">
            <ExternalLink size={14} /> Open
          </button>
        )}
        <button onClick={onDismiss} className="btn btn-sm btn-outline-secondary rounded-3 d-flex align-items-center gap-1">
          <XCircle size={14} />
        </button>
      </div>
    </div>
  );
};

export default ScanResult;


