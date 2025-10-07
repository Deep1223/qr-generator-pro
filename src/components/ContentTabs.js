import React from 'react';
import { MessageSquare, Link, Mail, Phone, Wifi, QrCode, Camera } from 'lucide-react';

/**
 * Modern Content type tabs for the QR Code Generator
 */
const ContentTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { 
      id: 'text', 
      label: 'Text', 
      icon: MessageSquare, 
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Plain text content'
    },
    { 
      id: 'scan', 
      label: 'Scan', 
      icon: Camera, 
      gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      description: 'Scan QR with camera'
    },
    { 
      id: 'url', 
      label: 'URL', 
      icon: Link, 
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Website links'
    },
    { 
      id: 'email', 
      label: 'Email', 
      icon: Mail, 
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Email addresses'
    },
    { 
      id: 'phone', 
      label: 'Phone', 
      icon: Phone, 
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: 'Phone numbers'
    },
    { 
      id: 'sms', 
      label: 'SMS', 
      icon: MessageSquare, 
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      description: 'Text messages'
    },
    { 
      id: 'wifi', 
      label: 'WiFi', 
      icon: Wifi, 
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      description: 'WiFi networks'
    },
    { 
      id: 'vcard', 
      label: 'vCard', 
      icon: QrCode, 
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      description: 'Contact cards'
    },
  ];

  return (
    <div className="bg-white bg-opacity-95 rounded-4 shadow p-0 border border-white border-opacity-20" style={{ overflow: 'hidden' }}>
      <div className="list-group list-group-flush">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
              style={{ border: '0', background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent', color: isActive ? '#fff' : 'inherit' }}
            >
              <Icon size={18} />
              <span className="fw-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContentTabs;
