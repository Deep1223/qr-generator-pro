import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsqr from 'jsqr';
import { Camera, RefreshCcw, StopCircle, AlertTriangle, Upload } from 'lucide-react';

const QRCodeScanner = ({ onResult, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);
  const fileInputRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const scanFrame = useCallback(() => {
    animationRef.current = requestAnimationFrame(scanFrame);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const code = jsqr(imageData.data, imageData.width, imageData.height);
    if (code && code.data) {
      stopCamera();
      onResult && onResult(code.data);
      onClose && onClose();
    }
  }, [onResult, onClose, stopCamera]);

  useEffect(() => {
    const startCamera = async () => {
      setError('');
      try {
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsActive(true);
          scanFrame();
        }
      } catch (e) {
        setError('Camera access denied or unavailable.');
        setIsActive(false);
      }
    };

    startCamera();
    return () => stopCamera();
  }, [scanFrame, stopCamera]);


  const handleRetry = () => {
    stopCamera();
    setTimeout(() => {
      setError('');
      setIsActive(false);
      // restart
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setIsActive(true);
            scanFrame();
          }
        } catch (e) {
          setError('Camera access denied or unavailable.');
          setIsActive(false);
        }
      })();
    }, 200);
  };

  const decodeFromImage = (img) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      if (!width || !height) return;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsqr(imageData.data, imageData.width, imageData.height);
      if (code && code.data) {
        stopCamera();
        onResult && onResult(code.data);
        onClose && onClose();
      } else {
        setError('No QR code found in the selected image.');
      }
    } catch (e) {
      setError('Failed to decode the selected image.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    // Clear any previous error before decoding
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => decodeFromImage(img);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    // Allow selecting the same file again by resetting the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-4 shadow-lg p-3 border border-white border-opacity-20">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Camera size={22} className="text-primary" />
          <h3 className="h5 fw-bold mb-0">Scan QR Code</h3>
        </div>
        <button onClick={() => { stopCamera(); onClose && onClose(); }} className="btn btn-sm btn-outline-secondary rounded-3">
          <StopCircle size={16} />
        </button>
      </div>

      {error ? (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <AlertTriangle size={16} />
          <div>{error}</div>
          <button onClick={handleRetry} className="btn btn-sm btn-warning ms-auto d-flex align-items-center gap-1">
            <RefreshCcw size={14} /> Retry
          </button>
        </div>
      ) : (
        <div className="position-relative rounded-3 overflow-hidden" style={{ background: '#000' }}>
          <video ref={videoRef} className="w-100" playsInline muted style={{ transform: 'scaleX(-1)' }} />
          {/* scanning overlay */}
          {isActive && (
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none' }}>
              <div className="position-absolute w-100" style={{ top: 0, height: '3px', background: 'linear-gradient(90deg, transparent, rgba(0,255,163,0.8), transparent)', animation: 'scanLine 2s linear infinite' }}></div>
              <div className="position-absolute top-0 start-0 w-100 h-100 border border-success border-2 opacity-50 rounded-3"></div>
            </div>
          )}
          <canvas ref={canvasRef} className="d-none" />
        </div>
      )}

      {/* Image upload option */}
      <div className="mt-3 d-flex align-items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="btn btn-outline-primary rounded-3 d-flex align-items-center gap-2"
        >
          <Upload size={16} /> Upload QR Image
        </button>
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="btn btn-success rounded-3 d-flex align-items-center gap-2"
        >
          <RefreshCcw size={16} /> Decrypt QR
        </button>
        <small className="text-muted">PNG, JPG, or SVG rasterized</small>
      </div>
    </div>
  );
};

export default QRCodeScanner;


