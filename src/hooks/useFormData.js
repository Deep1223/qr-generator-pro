import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form data for different QR code types
 */
export const useFormData = () => {
  const [urlData, setUrlData] = useState('');
  const [textData, setTextData] = useState('');
  const [emailData, setEmailData] = useState({ email: '', subject: '', body: '' });
  const [phoneData, setPhoneData] = useState('');
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [smsData, setSmsData] = useState({ number: '', message: '' });
  const [vCardData, setVCardData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    company: '', 
    website: '' 
  });

  // Generate QR data based on active tab
  const generateQRData = useCallback((activeTab) => {
    let data = '';
    
    switch (activeTab) {
      case 'url':
        data = urlData;
        break;
      case 'text':
        data = textData;
        break;
      case 'email':
        if (emailData.email) {
          const params = new URLSearchParams();
          if (emailData.subject) params.append('subject', emailData.subject);
          if (emailData.body) params.append('body', emailData.body);
          const queryString = params.toString();
          data = `mailto:${emailData.email}${queryString ? `?${queryString}` : ''}`;
        }
        break;
      case 'phone':
        data = phoneData ? `tel:${phoneData}` : '';
        break;
      case 'sms':
        if (smsData.number) {
          const params = new URLSearchParams();
          if (smsData.message) params.append('body', smsData.message);
          const queryString = params.toString();
          data = `sms:${smsData.number}${queryString ? `?${queryString}` : ''}`;
        }
        break;
      case 'wifi':
        if (wifiData.ssid) {
          data = `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
        }
        break;
      case 'vcard':
        if (vCardData.name) {
          let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
          vcard += `FN:${vCardData.name}\n`;
          if (vCardData.phone) vcard += `TEL:${vCardData.phone}\n`;
          if (vCardData.email) vcard += `EMAIL:${vCardData.email}\n`;
          if (vCardData.company) vcard += `ORG:${vCardData.company}\n`;
          if (vCardData.website) vcard += `URL:${vCardData.website}\n`;
          vcard += 'END:VCARD';
          data = vcard;
        }
        break;
      default:
        data = '';
    }
    
    return data;
  }, [urlData, textData, emailData, phoneData, wifiData, smsData, vCardData]);

  // Reset all form data
  const resetFormData = useCallback(() => {
    setUrlData('');
    setTextData('');
    setEmailData({ email: '', subject: '', body: '' });
    setPhoneData('');
    setWifiData({ ssid: '', password: '', encryption: 'WPA' });
    setSmsData({ number: '', message: '' });
    setVCardData({ name: '', phone: '', email: '', company: '', website: '' });
  }, []);

  return {
    // Form data state
    urlData,
    textData,
    emailData,
    phoneData,
    wifiData,
    smsData,
    vCardData,
    
    // Form data setters
    setUrlData,
    setTextData,
    setEmailData,
    setPhoneData,
    setWifiData,
    setSmsData,
    setVCardData,
    
    // Utility functions
    generateQRData,
    resetFormData
  };
};
