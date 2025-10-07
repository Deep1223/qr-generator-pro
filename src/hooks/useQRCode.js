import { useState, useEffect, useRef, useCallback } from 'react';
import { generateQRCode } from '../utils/qrGenerator';
import { generateSimpleQRCode } from '../utils/simpleQRGenerator';
import { generateProperQRCode, generateStyledQRCode } from '../utils/properQRGenerator';
import { generateSimpleQR, generateQRToCanvas } from '../utils/simpleQRTest';

/**
 * Custom hook for QR code generation and management
 */
export const useQRCode = () => {
  const [qrData, setQrData] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [errorLevel, setErrorLevel] = useState('M');
  const [size, setSize] = useState(400);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoImage, setLogoImage] = useState(null);
  const [logoSize, setLogoSize] = useState(20);
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientColor2, setGradientColor2] = useState('#6366f1');
  
  const canvasRef = useRef(null);

  // Generate QR code when dependencies change
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (qrData && canvasRef.current) {
        const options = {
          size,
          fgColor,
          bgColor,
          logoImage,
          logoSize,
          gradientEnabled,
          gradientColor2,
          errorLevel
        };
        
        // Prefer proper generator when a logo or gradient is requested to ensure centered logo drawing
        let qrCodeDataURL;
        try {
          console.log('Starting QR generation for:', qrData);
          
          if (logoImage || gradientEnabled) {
            // Ensure high error correction when embedding a logo
            const properOptions = { ...options, errorLevel: 'H' };
            qrCodeDataURL = await generateProperQRCode(qrData, properOptions, canvasRef.current);
            
            if (!qrCodeDataURL) {
              console.warn('Proper generator failed, trying styled generator');
              qrCodeDataURL = await generateStyledQRCode(qrData, properOptions, canvasRef.current);
            }
          } else {
            // Use simple QR generator path for speed when no logo/gradient
            qrCodeDataURL = await generateQRToCanvas(canvasRef.current, qrData, size);
            if (!qrCodeDataURL) {
              console.warn('Canvas generation failed, trying data URL method');
              qrCodeDataURL = await generateSimpleQR(qrData, size);
            }
            if (!qrCodeDataURL) {
              console.warn('Simple QR generation failed, trying styled generator');
              qrCodeDataURL = await generateStyledQRCode(qrData, options, canvasRef.current);
            }
            if (!qrCodeDataURL) {
              console.warn('Styled generation failed, trying proper generator');
              qrCodeDataURL = await generateProperQRCode(qrData, options, canvasRef.current);
            }
          }
          
          if (!qrCodeDataURL) {
            console.warn('All QR generation methods failed');
            qrCodeDataURL = '';
          }
        } catch (error) {
          console.error('QR generation failed:', error);
          qrCodeDataURL = '';
        }
        
        setQrCode(qrCodeDataURL);
      } else {
        setQrCode('');
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [qrData, fgColor, bgColor, size, logoImage, logoSize, errorLevel, gradientEnabled, gradientColor2]);

  // Handle logo upload
  const handleLogoUpload = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setLogoImage(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Remove logo
  const removeLogo = useCallback(() => {
    setLogoImage(null);
  }, []);

  // Update QR data
  const updateQRData = useCallback((data) => {
    setQrData(data);
  }, []);

  // Reset all settings to default
  const resetSettings = useCallback(() => {
    setErrorLevel('M');
    setSize(400);
    setFgColor('#000000');
    setBgColor('#ffffff');
    setLogoImage(null);
    setLogoSize(20);
    setGradientEnabled(false);
    setGradientColor2('#6366f1');
  }, []);

  return {
    // State
    qrData,
    qrCode,
    errorLevel,
    size,
    fgColor,
    bgColor,
    logoImage,
    logoSize,
    gradientEnabled,
    gradientColor2,
    
    // Refs
    canvasRef,
    
    // Setters
    setErrorLevel,
    setSize,
    setFgColor,
    setBgColor,
    setLogoSize,
    setGradientEnabled,
    setGradientColor2,
    
    // Actions
    updateQRData,
    handleLogoUpload,
    removeLogo,
    resetSettings
  };
};
