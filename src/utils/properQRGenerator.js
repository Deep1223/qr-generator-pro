import QRCode from 'qrcode';

/**
 * Proper QR Code Generator using the qrcode library
 * This generates standard-compliant QR codes that will scan properly
 */

/**
 * Generates a proper QR code using the qrcode library
 * @param {string} data - The data to encode
 * @param {Object} options - QR code options
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on (optional)
 * @returns {Promise<string>} - Data URL of the generated QR code
 */
export const generateProperQRCode = async (data, options, canvas = null) => {
  if (!data) {
    return '';
  }

  try {
    // Default options for QR code generation
    const qrOptions = {
      errorCorrectionLevel: options.errorLevel || 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      color: {
        dark: options.fgColor || '#000000',
        light: options.bgColor || '#ffffff'
      },
      width: options.size || 400
    };

    // If gradient is enabled, we need to handle it differently
    if (options.gradientEnabled && options.gradientColor2) {
      // For gradients, we'll generate a base QR code and then apply gradient styling
      const baseDataURL = await QRCode.toDataURL(data, qrOptions);
      
      if (canvas) {
        // Apply gradient to the canvas
        return applyGradientToQRCode(baseDataURL, options, canvas);
      }
      
      return baseDataURL;
    }

    // Generate QR code
    let dataURL;
    
    if (canvas) {
      // Generate directly to canvas
      await QRCode.toCanvas(canvas, data, qrOptions);
      
      // Apply logo if provided
      if (options.logoImage) {
        await addLogoToCanvas(canvas, options);
      }
      
      dataURL = canvas.toDataURL();
    } else {
      // Generate as data URL
      dataURL = await QRCode.toDataURL(data, qrOptions);
    }

    return dataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

/**
 * Applies gradient styling to a QR code
 * @param {string} baseDataURL - Base QR code data URL
 * @param {Object} options - Styling options
 * @param {HTMLCanvasElement} canvas - Canvas to draw on
 * @returns {string} - Data URL with gradient applied
 */
const applyGradientToQRCode = async (baseDataURL, options, canvas) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = options.size || 400;
      canvas.height = options.size || 400;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, options.fgColor);
      gradient.addColorStop(1, options.gradientColor2);
      
      // Draw the base QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Apply gradient effect
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add logo if provided
      if (options.logoImage) {
        addLogoToCanvas(canvas, options);
      }
      
      resolve(canvas.toDataURL());
    };
    img.src = baseDataURL;
  });
};

/**
 * Adds a logo to the center of the QR code canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} options - Options containing logoImage and logoSize
 */
const addLogoToCanvas = (canvas, options) => {
  const ctx = canvas.getContext('2d');
  const logoSize = (canvas.width * options.logoSize) / 100;
  const logoX = (canvas.width - logoSize) / 2;
  const logoY = (canvas.height - logoSize) / 2;
  
  // White background for logo
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(logoX - 10, logoY - 10, logoSize + 20, logoSize + 20);
  
  // Draw logo
  ctx.drawImage(options.logoImage, logoX, logoY, logoSize, logoSize);
};

/**
 * Generates QR code with custom styling (squares, dots, rounded)
 * @param {string} data - The data to encode
 * @param {Object} options - QR code options
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {Promise<string>} - Data URL of the generated QR code
 */
export const generateStyledQRCode = async (data, options, canvas) => {
  if (!data || !canvas) {
    return '';
  }

  try {
    // First generate a standard QR code to get the matrix
    const tempCanvas = document.createElement('canvas');
    await QRCode.toCanvas(tempCanvas, data, {
      errorCorrectionLevel: options.errorLevel || 'M',
      margin: 0,
      width: 400
    });

    // Get the QR code matrix from the canvas
    const ctx = tempCanvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Set up main canvas
    canvas.width = options.size || 400;
    canvas.height = options.size || 400;
    const mainCtx = canvas.getContext('2d');
    
    // Fill background
    mainCtx.fillStyle = options.bgColor || '#ffffff';
    mainCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set foreground style
    if (options.gradientEnabled) {
      const gradient = mainCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, options.fgColor);
      gradient.addColorStop(1, options.gradientColor2);
      mainCtx.fillStyle = gradient;
    } else {
      mainCtx.fillStyle = options.fgColor || '#000000';
    }
    
    // Calculate module size
    const moduleSize = canvas.width / 25; // Standard QR code has 25x25 modules for version 1
    
    // Draw modules with custom styling
    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        const pixelIndex = (y * 25 + x) * 4;
        const isDark = imageData.data[pixelIndex] < 128; // Check if pixel is dark
        
        if (isDark) {
          const moduleX = x * moduleSize;
          const moduleY = y * moduleSize;
          
          // Apply custom module style
          drawCustomModule(mainCtx, moduleX, moduleY, moduleSize, options.qrStyle || 'squares');
        }
      }
    }
    
    // Add logo if provided
    if (options.logoImage) {
      addLogoToCanvas(canvas, options);
    }
    
    return canvas.toDataURL();
  } catch (error) {
    console.error('Error generating styled QR code:', error);
    // Fallback to standard QR code
    return generateProperQRCode(data, options, canvas);
  }
};

/**
 * Draws a custom module with the specified style
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Module size
 * @param {string} style - Module style
 */
const drawCustomModule = (ctx, x, y, size, style) => {
  switch (style) {
    case 'dots':
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'rounded':
      ctx.beginPath();
      const radius = size / 4;
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + size - radius, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
      ctx.lineTo(x + size, y + size - radius);
      ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
      ctx.lineTo(x + radius, y + size);
      ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.fill();
      break;
    case 'squares':
    default:
      ctx.fillRect(x, y, size, size);
      break;
  }
};
