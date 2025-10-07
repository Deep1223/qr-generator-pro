import React, { useState } from 'react';
import Header from './Header';
import ContentTabs from './ContentTabs';
import ContentForm from './forms/ContentForm';
import CustomizationPanel from './customization/CustomizationPanel';
import QRPreview from './QRPreview';
import GenerateButton from './GenerateButton';
import QRHistory from './QRHistory';
import QRDebug from './QRDebug';
import QRCodeScanner from './QRCodeScanner';
import ScanResult from './ScanResult';
import { useQRCode } from '../hooks/useQRCode';
import { useFormData } from '../hooks/useFormData';

/**
 * Main QR Code Generator component
 */
const QRCodeGenerator = () => {
  const [activeTab, setActiveTab] = useState('text'); // Default to URL tab
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState(0);
  const [lastScanned, setLastScanned] = useState('');
  
  // Custom hooks
  const qrCodeHook = useQRCode();
  const formDataHook = useFormData();

  // Quick actions removed per request

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'scan') {
      // In scan mode, clear preview and skip generation
      qrCodeHook.updateQRData('');
      return;
    }
    // Update QR data when tab changes
    const qrData = formDataHook.generateQRData(tab);
    qrCodeHook.updateQRData(qrData);
  };

  // Handle form data change
  const handleFormDataChange = (field, value) => {
    console.log('Form data change:', field, value);
    
    // Update the specific form field
    const setter = `set${field.charAt(0).toUpperCase()}${field.slice(1)}`;
    if (formDataHook[setter]) {
      formDataHook[setter](value);
    }
  };

  // Handle manual QR generation
  const handleGenerate = async () => {
    console.log('Manual generate clicked');
    setIsGenerating(true);
    
    try {
      // Get current QR data
      const qrData = formDataHook.generateQRData(activeTab);
      console.log('Manual generation - QR data:', qrData);
      
      if (qrData.trim()) {
        // Update QR data
        qrCodeHook.updateQRData(qrData);
        
        // Simulate generation delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        setLastGeneratedAt(Date.now());
      } else {
        console.warn('No QR data to generate');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle QR history selection
  const handleQRSelect = (qrData) => {
    // Update the appropriate form field based on QR data type
    if (qrData.startsWith('http')) {
      formDataHook.setUrlData(qrData);
      setActiveTab('url');
    } else if (qrData.startsWith('mailto:')) {
      // Extract email from mailto URL
      const emailMatch = qrData.match(/mailto:([^?]+)/);
      if (emailMatch) {
        formDataHook.setEmailData({ email: emailMatch[1], subject: '', body: '' });
        setActiveTab('email');
      }
    } else if (qrData.startsWith('tel:')) {
      formDataHook.setPhoneData(qrData.replace('tel:', ''));
      setActiveTab('phone');
    } else if (qrData.startsWith('sms:')) {
      // Extract SMS data
      const smsMatch = qrData.match(/sms:([^?]+)/);
      if (smsMatch) {
        formDataHook.setSmsData({ number: smsMatch[1], message: '' });
        setActiveTab('sms');
      }
    } else {
      formDataHook.setTextData(qrData);
      setActiveTab('text');
    }
    
    // Update QR data
    qrCodeHook.updateQRData(qrData);
  };

  // Get current form data object
  const currentFormData = {
    urlData: formDataHook.urlData,
    textData: formDataHook.textData,
    emailData: formDataHook.emailData,
    phoneData: formDataHook.phoneData,
    smsData: formDataHook.smsData,
    wifiData: formDataHook.wifiData,
    vCardData: formDataHook.vCardData
  };

  return (
    <div className="min-vh-100 p-4" style={{ background: 'var(--app-bg, #f3f4f6)' }}>
      <div className="container-fluid max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <ContentTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </div>

          {/* Main Area */}
          <div className="col-lg-5">
            <div className="space-y-4">
              {activeTab === 'scan' ? (
                <QRCodeScanner
                  onResult={(data) => {
                    setLastScanned(data);
                    // Place scanned data into appropriate form and preview
                    if (data.startsWith('http')) {
                      formDataHook.setUrlData(data);
                      setActiveTab('url');
                    } else if (data.startsWith('mailto:')) {
                      const emailMatch = data.match(/mailto:([^?]+)/);
                      if (emailMatch) {
                        formDataHook.setEmailData({ email: emailMatch[1], subject: '', body: '' });
                        setActiveTab('email');
                      }
                    } else if (data.startsWith('tel:')) {
                      formDataHook.setPhoneData(data.replace('tel:', ''));
                      setActiveTab('phone');
                    } else if (data.startsWith('sms:')) {
                      const smsMatch = data.match(/sms:([^?]+)/);
                      if (smsMatch) {
                        formDataHook.setSmsData({ number: smsMatch[1], message: '' });
                        setActiveTab('sms');
                      }
                    } else if (data.startsWith('WIFI:')) {
                      // Keep in text for now; parsing can be added later
                      formDataHook.setTextData(data);
                      setActiveTab('text');
                    } else if (data.startsWith('BEGIN:VCARD')) {
                      formDataHook.setTextData(data);
                      setActiveTab('text');
                    } else {
                      formDataHook.setTextData(data);
                      setActiveTab('text');
                    }
                    qrCodeHook.updateQRData(data);
                  }}
                  onClose={() => {
                    // If user closes scanner, return to previous non-scan tab if empty
                    if (!qrCodeHook.qrData) {
                      setActiveTab('text');
                    }
                  }}
                />
              ) : (
                <>
                  {/* Content Form */}
                  <ContentForm
                    activeTab={activeTab}
                    formData={currentFormData}
                    onFormDataChange={handleFormDataChange}
                  />

                  {/* Generate Button */}
                  <div className="bg-white bg-opacity-95 rounded-4 shadow-lg p-4 border border-white border-opacity-20">
                    <GenerateButton
                      onGenerate={handleGenerate}
                      isGenerating={isGenerating}
                      qrData={formDataHook.generateQRData(activeTab)}
                      className="mb-3"
                    />
                  </div>
                </>
              )}

              {lastScanned && (
                <ScanResult
                  value={lastScanned}
                  onDismiss={() => setLastScanned('')}
                />
              )}

              {/* QR Code History */}
              <QRHistory
                qrCode={qrCodeHook.qrCode}
                qrData={qrCodeHook.qrData}
                onQRSelect={handleQRSelect}
                trigger={lastGeneratedAt}
              />
            </div>
          </div>

          {/* Right Panel: Preview + Customization */}
          <div className="col-lg-4">
            <QRPreview
              qrCode={qrCodeHook.qrCode}
              size={qrCodeHook.size}
              errorLevel={qrCodeHook.errorLevel}
              logoImage={qrCodeHook.logoImage}
            />

            <div className="mt-4">
              <CustomizationPanel
                // Color settings
                fgColor={qrCodeHook.fgColor}
                bgColor={qrCodeHook.bgColor}
                gradientEnabled={qrCodeHook.gradientEnabled}
                gradientColor2={qrCodeHook.gradientColor2}
                onFgColorChange={qrCodeHook.setFgColor}
                onBgColorChange={qrCodeHook.setBgColor}
                onGradientToggle={qrCodeHook.setGradientEnabled}
                onGradientColor2Change={qrCodeHook.setGradientColor2}
                
                // Size and logo settings
                size={qrCodeHook.size}
                onSizeChange={qrCodeHook.setSize}
                logoImage={qrCodeHook.logoImage}
                logoSize={qrCodeHook.logoSize}
                onLogoSizeChange={qrCodeHook.setLogoSize}
                onLogoUpload={qrCodeHook.handleLogoUpload}
                onLogoRemove={qrCodeHook.removeLogo}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-muted">
          <p className="mb-0">QR Studio — Fast, simple, and customizable</p>
        </div>
      </div>

      {/* Hidden canvas for QR generation */}
      <canvas ref={qrCodeHook.canvasRef} className="d-none" />
    </div>
  );
};

export default QRCodeGenerator;
