import React from 'react';
import TextForm from './TextForm';
import UrlForm from './UrlForm';
import EmailForm from './EmailForm';
import PhoneForm from './PhoneForm';
import SmsForm from './SmsForm';
import WifiForm from './WifiForm';
import VCardForm from './VCardForm';

/**
 * Main content form component that renders the appropriate form based on active tab
 */
const ContentForm = ({ 
  activeTab, 
  formData, 
  onFormDataChange 
}) => {
  const renderForm = () => {
    switch (activeTab) {
      case 'text':
        return (
          <TextForm
            value={formData.textData}
            onChange={(value) => onFormDataChange('textData', value)}
          />
        );
      case 'url':
        return (
          <UrlForm
            value={formData.urlData}
            onChange={(value) => onFormDataChange('urlData', value)}
          />
        );
      case 'email':
        return (
          <EmailForm
            value={formData.emailData}
            onChange={(value) => onFormDataChange('emailData', value)}
          />
        );
      case 'phone':
        return (
          <PhoneForm
            value={formData.phoneData}
            onChange={(value) => onFormDataChange('phoneData', value)}
          />
        );
      case 'sms':
        return (
          <SmsForm
            value={formData.smsData}
            onChange={(value) => onFormDataChange('smsData', value)}
          />
        );
      case 'wifi':
        return (
          <WifiForm
            value={formData.wifiData}
            onChange={(value) => onFormDataChange('wifiData', value)}
          />
        );
      case 'vcard':
        return (
          <VCardForm
            value={formData.vCardData}
            onChange={(value) => onFormDataChange('vCardData', value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-4 shadow-lg p-4 border border-white border-opacity-20">
      <div className="mb-3">
        <h2 className="h5 fw-bold mb-1">Text Content</h2>
        <p className="text-muted small mb-0">Enter the content for your QR code. You can paste existing text or use Sample to try quickly.</p>
      </div>
      {renderForm()}
    </div>
  );
};

export default ContentForm;
