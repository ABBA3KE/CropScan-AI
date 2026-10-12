'use client';

/**
 * CameraCapture Component
 * Real-time camera viewfinder using navigator.mediaDevices.getUserMedia
 * Defaults to rear camera with switch camera and fallback to file input.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, FlipHorizontal } from 'lucide-react';

export default function CameraCapture({ onCapture, onCancel, onFallbackToFile }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // default to rear camera
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [flashActive, setFlashActive] = useState(false);

  // Initialize camera stream
  useEffect(() => {
    let currentStream = null;

    async function startCamera() {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API (getUserMedia) not supported in this browser.');
        }

        const constraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('[Camera Error]:', err);
        setCameraError(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Camera permission was denied. Please allow camera access in browser settings or use photo upload.'
            : err.message || 'Unable to access camera.'
        );
      }
    }

    if (!capturedImage) {
      startCamera();
    }

    // Cleanup tracks on unmount or mode switch
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, capturedImage]);

  // Stop stream helper
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Toggle front / back camera
  const switchCamera = () => {
    stopStream();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture still photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;

    // Trigger visual shutter flash
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `crop_camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const previewUrl = canvas.toDataURL('image/jpeg', 0.9);
        stopStream();
        setCapturedImage({ file, previewUrl });
      },
      'image/jpeg',
      0.9
    );
  };

  // Retake photo
  const retake = () => {
    setCapturedImage(null);
  };

  // Confirm photo
  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage.file, capturedImage.previewUrl);
    }
  };

  // If camera permission denied or error
  if (cameraError) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center my-4 shadow-sm">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Camera Not Accessible</h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">{cameraError}</p>
        <div className="space-y-2">
          <button
            onClick={onFallbackToFile}
            className="w-full py-3 bg-agri-600 hover:bg-agri-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <Camera className="w-4 h-4" />
            <span>Take Photo via System Camera</span>
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col aspect-[3/4] sm:max-h-[580px]">
      {/* Visual Shutter Flash */}
      {flashActive && <div className="absolute inset-0 bg-white z-30 pointer-events-none opacity-80" />}

      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <button
          onClick={() => {
            stopStream();
            onCancel();
          }}
          className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
          aria-label="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {!capturedImage && (
          <button
            onClick={switchCamera}
            className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md flex items-center gap-1.5 text-xs font-medium px-3.5"
            title="Switch camera"
          >
            <FlipHorizontal className="w-4 h-4" />
            <span>{facingMode === 'environment' ? 'Rear' : 'Front'}</span>
          </button>
        )}
      </div>

      {/* Video Viewfinder or Captured Preview */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black">
        {capturedImage ? (
          <img
            src={capturedImage.previewUrl}
            alt="Captured crop"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder Target Reticle */}
            <div className="absolute inset-10 border-2 border-white/50 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <span className="w-4 h-4 border-t-2 border-l-2 border-agri-400" />
                <span className="w-4 h-4 border-t-2 border-r-2 border-agri-400" />
              </div>
              <div className="text-center">
                <span className="text-[11px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  Align crop leaf or fruit in box
                </span>
              </div>
              <div className="flex justify-between">
                <span className="w-4 h-4 border-b-2 border-l-2 border-agri-400" />
                <span className="w-4 h-4 border-b-2 border-r-2 border-agri-400" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center px-6">
        {capturedImage ? (
          <div className="flex items-center gap-4 w-full max-w-xs justify-around">
            <button
              onClick={retake}
              className="flex-1 py-3 px-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 border border-white/30 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake</span>
            </button>
            <button
              onClick={confirmPhoto}
              className="flex-1 py-3 px-4 bg-agri-600 hover:bg-agri-500 text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-agri-600/40 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Use Photo</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {/* Big Shutter Button */}
            <button
              onClick={capturePhoto}
              className="w-18 h-18 p-1 rounded-full border-4 border-white/80 flex items-center justify-center active:scale-90 transition-transform group focus:outline-none"
              aria-label="Capture photo"
            >
              <div className="w-14 h-14 rounded-full bg-white group-hover:bg-agri-100 transition-colors shadow-lg" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
