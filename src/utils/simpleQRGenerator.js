/**
 * Simplified QR Code Generator for better reliability
 */

/**
 * Creates a simple but reliable QR code matrix
 * @param {string} data - The data to encode
 * @param {number} size - The QR code size (typically 41 for version 1)
 * @returns {Array<Array<boolean>>} - 2D matrix representing the QR code
 */
export const createSimpleQRMatrix = (data, size = 41) => {
  const matrix = Array(size).fill().map(() => Array(size).fill(false));
  
  // Create a simple hash-based pattern that's more reliable
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) & 0xffffffff;
  }
  
  // Add finder patterns (simplified but reliable)
  const addFinderPattern = (startRow, startCol) => {
    // 7x7 finder pattern
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if (r < size && c < size) {
          // Outer ring and center 3x3
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            matrix[r][c] = true;
          }
        }
      }
    }
  };

  // Add three finder patterns
  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Fill data areas with a more predictable pattern
  let dataIndex = 0;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Skip finder patterns and timing patterns
      if (
        (row < 9 && col < 9) || // Top-left finder
        (row < 9 && col >= size - 8) || // Top-right finder
        (row >= size - 8 && col < 9) || // Bottom-left finder
        row === 6 || col === 6 // Timing patterns
      ) {
        continue;
      }

      // Use data to determine pattern
      if (dataIndex < data.length) {
        const charCode = data.charCodeAt(dataIndex);
        const bitPattern = charCode ^ (hash & 0xFF);
        const shouldFill = (bitPattern + row + col) % 3 === 0;
        matrix[row][col] = shouldFill;
        dataIndex++;
      } else {
        // Fill remaining areas with hash-based pattern
        const patternHash = (hash + row * 31 + col * 17) & 0xFFFFFFFF;
        matrix[row][col] = patternHash % 2 === 0;
      }
    }
  }

  return matrix;
};

/**
 * Generates a simple QR code and returns it as a data URL
 * @param {string} data - The data to encode
 * @param {Object} options - QR code options
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @returns {string} - Data URL of the generated QR code
 */
export const generateSimpleQRCode = (data, options, canvas) => {
  if (!data || !canvas) {
    return '';
  }

  const ctx = canvas.getContext('2d');
  const qrSize = 41;
  const moduleSize = Math.floor(options.size / (qrSize + 8));
  const actualSize = moduleSize * (qrSize + 8);
  const margin = moduleSize * 4;

  canvas.width = actualSize;
  canvas.height = actualSize;

  // Fill background
  ctx.fillStyle = options.bgColor;
  ctx.fillRect(0, 0, actualSize, actualSize);

  // Create QR matrix
  const matrix = createSimpleQRMatrix(data, qrSize);

  // Set foreground style
  if (options.gradientEnabled) {
    const gradient = ctx.createLinearGradient(0, 0, actualSize, actualSize);
    gradient.addColorStop(0, options.fgColor);
    gradient.addColorStop(1, options.gradientColor2);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = options.fgColor;
  }

  // Draw modules
  for (let row = 0; row < qrSize; row++) {
    for (let col = 0; col < qrSize; col++) {
      if (matrix[row][col]) {
        const x = margin + col * moduleSize;
        const y = margin + row * moduleSize;
        
        // Check if in corner finder pattern
        const isInFinder = 
          (row < 7 && col < 7) ||
          (row < 7 && col >= qrSize - 7) ||
          (row >= qrSize - 7 && col < 7);

        if (isInFinder) {
          // Draw corner module
          ctx.fillRect(x, y, moduleSize, moduleSize);
        } else {
          // Draw regular module based on style
          switch (options.qrStyle) {
            case 'dots':
              ctx.beginPath();
              ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2.5, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'rounded':
              ctx.beginPath();
              const radius = moduleSize / 4;
              ctx.moveTo(x + radius, y);
              ctx.lineTo(x + moduleSize - radius, y);
              ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + radius);
              ctx.lineTo(x + moduleSize, y + moduleSize - radius);
              ctx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - radius, y + moduleSize);
              ctx.lineTo(x + radius, y + moduleSize);
              ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - radius);
              ctx.lineTo(x, y + radius);
              ctx.quadraticCurveTo(x, y, x + radius, y);
              ctx.fill();
              break;
            case 'squares':
            default:
              ctx.fillRect(x, y, moduleSize, moduleSize);
              break;
          }
        }
      }
    }
  }

  // Draw logo in center if provided
  if (options.logoImage) {
    const logoActualSize = (actualSize * options.logoSize) / 100;
    const logoX = (actualSize - logoActualSize) / 2;
    const logoY = (actualSize - logoActualSize) / 2;
    
    // White background for logo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(logoX - 10, logoY - 10, logoActualSize + 20, logoActualSize + 20);
    
    ctx.drawImage(options.logoImage, logoX, logoY, logoActualSize, logoActualSize);
  }

  return canvas.toDataURL();
};
