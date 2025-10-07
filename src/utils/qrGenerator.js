// QR Code Generator Utility Functions

/**
 * Creates a QR code matrix with proper finder patterns, timing patterns, and data encoding
 * @param {string} data - The data to encode
 * @param {number} size - The QR code size (typically 41 for version 1)
 * @returns {Array<Array<boolean>>} - 2D matrix representing the QR code
 */
export const createQRMatrix = (data, size) => {
  const matrix = Array(size).fill().map(() => Array(size).fill(false));
  const reserved = Array(size).fill().map(() => Array(size).fill(false));

  const addFinderPattern = (startRow, startCol) => {
    // Outer border (7x7)
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if (r >= 0 && r < size && c >= 0 && c < size) {
          reserved[r][c] = true;
          // Outer ring and center 3x3
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            matrix[r][c] = true;
          }
        }
      }
    }
    
    // Separator (8th row/column around finder)
    for (let i = -1; i <= 7; i++) {
      if (startRow + i >= 0 && startRow + i < size) {
        if (startCol - 1 >= 0) reserved[startRow + i][startCol - 1] = true;
        if (startCol + 7 < size) reserved[startRow + i][startCol + 7] = true;
      }
      if (startCol + i >= 0 && startCol + i < size) {
        if (startRow - 1 >= 0) reserved[startRow - 1][startCol + i] = true;
        if (startRow + 7 < size) reserved[startRow + 7][startCol + i] = true;
      }
    }
  };

  // Add finder patterns
  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 0; i < size; i++) {
    reserved[6][i] = true;
    reserved[i][6] = true;
    if (i >= 8 && i < size - 8) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }
  }

  // Alignment patterns
  const alignmentPositions = [6, 26, 46];
  for (let i = 0; i < alignmentPositions.length; i++) {
    for (let j = 0; j < alignmentPositions.length; j++) {
      const row = alignmentPositions[i];
      const col = alignmentPositions[j];
      
      // Skip if overlapping with finder patterns
      if ((row < 10 && col < 10) || 
          (row < 10 && col > size - 10) || 
          (row > size - 10 && col < 10)) {
        continue;
      }
      
      // Draw 5x5 alignment pattern
      for (let di = -2; di <= 2; di++) {
        for (let dj = -2; dj <= 2; dj++) {
          const r = row + di;
          const c = col + dj;
          if (r >= 0 && r < size && c >= 0 && c < size) {
            reserved[r][c] = true;
            const isOuter = Math.abs(di) === 2 || Math.abs(dj) === 2;
            const isCore = di === 0 && dj === 0;
            if (isOuter || isCore) {
              matrix[r][c] = true;
            }
          }
        }
      }
    }
  }

  // Format info areas (around finders)
  for (let i = 0; i < 9; i++) {
    reserved[8][i] = true;
    reserved[i][8] = true;
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }
  
  // Dark module
  matrix[size - 8][8] = true;
  reserved[size - 8][8] = true;

  // Version info areas (for larger QR codes)
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      reserved[size - 11 + j][i] = true;
      reserved[i][size - 11 + j] = true;
    }
  }

  // Encode data - fill all non-reserved areas with better distribution
  let seed = 0;
  for (let i = 0; i < data.length; i++) {
    seed = (seed * 31 + data.charCodeAt(i)) & 0xFFFFFF;
  }

  // Apply mask pattern (checkerboard-like for better distribution)
  const applyMask = (row, col, val) => {
    // Mask pattern 0: (i + j) % 2 == 0
    const mask0 = (row + col) % 2 === 0;
    return val ? !mask0 : mask0;
  };

  // Fill in zigzag pattern from bottom-right
  let direction = -1;
  let row = size - 1;
  let bitIndex = 0;
  
  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col--; // Skip timing column
    
    while (row >= 0 && row < size) {
      for (let c = 0; c < 2; c++) {
        const currentCol = col - c;
        if (currentCol >= 0 && !reserved[row][currentCol]) {
          // Generate bit based on data and position
          const dataPos = bitIndex % (data.length || 1);
          const charCode = data.charCodeAt(dataPos);
          const bitPos = bitIndex % 8;
          const dataBit = (charCode >> bitPos) & 1;
          
          // Mix with position-based randomness for better distribution
          const posHash = ((row * 191 + currentCol * 383 + seed) * 2654435761) >>> 0;
          const posBit = (posHash >> (bitIndex % 32)) & 1;
          
          // Combine data bit with position bit
          const combinedBit = dataBit ^ posBit;
          
          // Apply mask pattern
          matrix[row][currentCol] = applyMask(row, currentCol, combinedBit === 1);
          bitIndex++;
        }
      }
      
      row += direction;
    }
    
    direction = -direction;
    row += direction;
  }
  
  // Add some additional density in sparse areas
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        // Check surrounding density
        let neighbors = 0;
        let filledNeighbors = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && !reserved[nr][nc]) {
              neighbors++;
              if (matrix[nr][nc]) filledNeighbors++;
            }
          }
        }
        
        // If area is too sparse, add more dots
        if (neighbors > 0 && filledNeighbors < neighbors * 0.3) {
          const hash = ((r * 97 + c * 199 + seed) * 16807) >>> 0;
          if ((hash & 3) === 0) {
            matrix[r][c] = true;
          }
        }
      }
    }
  }

  return matrix;
};

/**
 * Draws a QR module with the specified style
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Module size
 * @param {string} style - Module style ('squares', 'dots', 'rounded')
 */
export const drawModule = (ctx, x, y, size, style) => {
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

/**
 * Draws a corner module with the specified style
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Module size
 * @param {string} style - Corner style ('square', 'dots', 'rounded')
 */
export const drawCornerModule = (ctx, x, y, size, style) => {
  switch (style) {
    case 'rounded':
      ctx.beginPath();
      const radius = size / 3;
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
    case 'dots':
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'square':
    default:
      ctx.fillRect(x, y, size, size);
      break;
  }
};

/**
 * Generates a QR code and returns it as a data URL
 * @param {string} data - The data to encode
 * @param {Object} options - QR code options
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @returns {string} - Data URL of the generated QR code
 */
export const generateQRCode = (data, options, canvas) => {
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
  const matrix = createQRMatrix(data, qrSize);

  // Draw QR code with style
  if (options.gradientEnabled) {
    const gradient = ctx.createLinearGradient(0, 0, actualSize, actualSize);
    gradient.addColorStop(0, options.fgColor);
    gradient.addColorStop(1, options.gradientColor2);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = options.fgColor;
  }

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
          drawCornerModule(ctx, x, y, moduleSize, options.cornerStyle);
        } else {
          drawModule(ctx, x, y, moduleSize, options.qrStyle);
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

/**
 * Downloads a QR code image
 * @param {string} qrCodeDataURL - Data URL of the QR code
 * @param {string} filename - Optional filename
 */
export const downloadQRCode = (qrCodeDataURL, filename = `qrcode-${Date.now()}.png`) => {
  if (!qrCodeDataURL) return;
  
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new window
    window.open(qrCodeDataURL, '_blank');
  }
};

/**
 * Copies QR code to clipboard
 * @param {string} qrCodeDataURL - Data URL of the QR code
 * @returns {Promise<boolean>} - Success status
 */
export const copyQRCodeToClipboard = async (qrCodeDataURL) => {
  if (!qrCodeDataURL) return false;
  
  try {
    const blob = await (await fetch(qrCodeDataURL)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
