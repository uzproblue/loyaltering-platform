'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [containerId] = useState(() => 'qr-scanner-container-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9));
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Clean up scanner when modal is closed
      if (scannerRef.current) {
        scannerRef.current.stop().catch((err) => {
          console.error('Error stopping scanner:', err);
        }).finally(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        });
      }
      setError(null);
      setIsInitializing(false);
      setIsScanning(false);
      return;
    }

    setIsInitializing(true);
    setError(null);
    setIsScanning(false);

    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(async () => {
      const containerElement = document.getElementById(containerId);
      if (!containerElement) {
        console.error('Container element not found:', containerId);
        setError('Scanner container not found. Please try again.');
        setIsInitializing(false);
        return;
      }

      try {
        console.log('Initializing QR scanner in container:', containerId);

        // Create scanner instance
        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        // Get available cameras and request permission
        console.log('Requesting camera access...');
        const cameras = await Html5Qrcode.getCameras();
        
        if (!cameras || cameras.length === 0) {
          throw new Error('No camera found. Please ensure a camera is connected.');
        }

        console.log('Cameras found:', cameras.length);
        
        // Use the first available camera (usually the default/back camera)
        const cameraId = cameras[0].id;
        
        // Start scanning immediately
        console.log('Starting camera with ID:', cameraId);
        
        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: undefined, // No scanning rectangle overlay
            aspectRatio: 1.0,
            videoConstraints: {
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            disableFlip: false,
          },
          (decodedText) => {
            // QR code detected
            console.log('QR Code scanned:', decodedText);
            onScanSuccess(decodedText);
            // Stop scanning and close modal
            scanner.stop().then(() => {
              scanner.clear();
              onClose();
            }).catch((err) => {
              console.error('Error stopping scanner after scan:', err);
              onClose();
            });
          },
          (errorMessage) => {
            // Scan error (usually just means no QR code found yet)
            // Only log if it's not the common "NotFoundException"
            if (
              !errorMessage.includes('NotFoundException') &&
              !errorMessage.includes('No QR code found') &&
              !errorMessage.includes('QR code parse error')
            ) {
              console.debug('QR scan error:', errorMessage);
            }
          }
        );

        console.log('Camera started successfully');
        setIsInitializing(false);
        setIsScanning(true);
      } catch (err: any) {
        console.error('Error initializing QR scanner:', err);
        let errorMsg = 'Failed to initialize camera.';
        
        if (err.message) {
          if (err.message.includes('Permission') || err.message.includes('permission')) {
            errorMsg = 'Camera permission denied. Please allow camera access and try again.';
          } else if (err.message.includes('NotFound') || err.message.includes('not found') || err.message.includes('No camera')) {
            errorMsg = 'No camera found. Please ensure a camera is connected.';
          } else {
            errorMsg = err.message;
          }
        }
        
        setError(errorMsg);
        setIsInitializing(false);
        setIsScanning(false);
      }
    }, 300); // Delay to ensure DOM is ready and container is visible

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop().catch((err) => {
          console.error('Error stopping scanner on cleanup:', err);
        }).finally(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        });
      }
    };
  }, [isOpen, onClose, onScanSuccess, containerId]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Debug: log modal state
  useEffect(() => {
    if (isOpen) {
      console.log('QRScannerModal is opening, containerId:', containerId);
    }
  }, [isOpen, containerId]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
      onClick={onClose}
      style={{ zIndex: 70 }}
    >
      <div
        className="bg-white dark:bg-background-dark w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white dark:bg-background-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">QR Code Scanner</h2>
              <p className="text-xs opacity-50">Position QR code within the frame</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close scanner"
          >
            <span className="material-symbols-outlined opacity-60">close</span>
          </button>
        </div>

        {/* Scanner Container */}
        <div className="p-8">
          {error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-600 text-3xl">error</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Camera Error</h3>
              <p className="text-sm opacity-60 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Show loading message while scanner initializes */}
              {isInitializing && (
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="material-symbols-outlined text-primary text-3xl">qr_code_scanner</span>
                  </div>
                  <p className="text-sm opacity-60">Requesting camera access...</p>
                  <p className="text-xs opacity-40 mt-1">Please allow camera access when prompted</p>
                </div>
              )}
              {/* Container for scanner - camera feed will appear here */}
              <div className="flex justify-center">
                <div
                  id={containerId}
                  className="w-full max-w-lg rounded-lg overflow-hidden bg-black/5 dark:bg-white/5"
                  style={{ maxHeight: '480px', aspectRatio: '4/3' }}
                />
              </div>
              {isScanning && (
                <div className="text-center mt-4">
                  <p className="text-xs opacity-60">Position QR code within the frame</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-background-light dark:bg-white/5 border-t border-black/5 dark:border-white/5 text-center">
          <p className="text-xs opacity-60">Press ESC or click outside to close</p>
        </div>
      </div>
    </div>
  );
}
