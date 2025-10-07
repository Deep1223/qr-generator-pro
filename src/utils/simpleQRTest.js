import QRCode from 'qrcode';

/**
 * Simple QR Code Generator for testing - guaranteed to work
 */
export const generateSimpleQR = async (data, size = 400) => {
  if (!data) {
    return '';
  }

  try {
    console.log('Generating QR for:', data);
    
    // Simple options that always work
    const options = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      width: size
    };

    // Generate QR code as data URL
    const dataURL = await QRCode.toDataURL(data, options);
    
    console.log('QR generated successfully:', dataURL.substring(0, 50) + '...');
    return dataURL;
  } catch (error) {
    console.error('Error in simple QR generation:', error);
    return '';
  }
};

/**
 * Generate QR code to canvas
 */
export const generateQRToCanvas = async (canvas, data, size = 400) => {
  if (!data || !canvas) {
    return '';
  }

  try {
    console.log('Generating QR to canvas for:', data);
    
    const options = {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: size
    };

    await QRCode.toCanvas(canvas, data, options);
    
    const dataURL = canvas.toDataURL();
    console.log('Canvas QR generated successfully');
    return dataURL;
  } catch (error) {
    console.error('Error generating QR to canvas:', error);
    return '';
  }
};
