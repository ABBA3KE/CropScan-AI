'use client';

/**
 * Scan Screen
 * Handles crop capture (live camera with rear default & fallback),
 * image upload (drag-drop/picker with JPG, PNG, WEBP),
 * crop selector (Auto Detect default),
 * client-side compression to ~1280px max edge,
 * animated scanning state overlay,
 * and comprehensive ResultCard display with guest save workflow.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import CameraCapture from '../../components/CameraCapture';
import ScanningOverlay from '../../components/ScanningOverlay';
import ResultCard from '../../components/ResultCard';
import AuthModal from '../../components/AuthModal';
import { compressAndResizeImage } from '../../lib/imageUtils';
import { scanCropApi, saveScanApi } from '../../lib/api';
import {
  saveGuestLatestScan,
  getGuestLatestScan,
  setPendingScan
} from '../../lib/storage';
import { SUPPORTED_CROPS } from '../../lib/crops.config';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  AlertCircle,
  FileImage,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScanPage() {
  const { user, showToast } = useAuth();

  // Mode: 'select' | 'camera' | 'preview' | 'scanning' | 'result'
  const [mode, setMode] = useState('select');

  // Input states
  const [selectedCrop, setSelectedCrop] = useState('Auto Detect');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  // Save states
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Hidden file inputs
  const filePickerRef = useRef(null);
  const cameraInputRef = useRef(null);

  // On initial mount, check if there is an unsaved guest scan to restore
  useEffect(() => {
    const cached = getGuestLatestScan();
    if (cached && cached.result && !analysisResult) {
      setAnalysisResult(cached.result);
      setPreviewUrl(cached.previewUrl);
      setMode('result');
    }
  }, []);

  // Trigger confetti when healthy crop is detected
  useEffect(() => {
    if (mode === 'result' && analysisResult?.status === 'healthy') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [mode, analysisResult]);

  // Handle selected image file (either from upload or camera fallback)
  const handleFileSelected = async (file) => {
    if (!file) return;

    setError(null);
    try {
      // 1. Client-side compress and resize
      const compressed = await compressAndResizeImage(file, 1280, 0.85);
      setImageFile(compressed.file);
      setPreviewUrl(compressed.previewUrl);
      setMode('preview');
    } catch (err) {
      console.error('Image compression error:', err);
      setError('Unable to process the image. Please select another file.');
    }
  };

  // Camera captured photo handler
  const handleCameraCapture = (file, url) => {
    setImageFile(file);
    setPreviewUrl(url);
    setMode('preview');
  };

  // Trigger AI Scan
  const startScan = async () => {
    if (!imageFile) return;

    setError(null);
    setMode('scanning');

    try {
      const res = await scanCropApi(imageFile, selectedCrop);
      if (res.success && res.data) {
        setAnalysisResult(res.data);
        setIsSaved(false);

        // If user is guest, persist to browser storage
        if (!user) {
          saveGuestLatestScan(res.data, previewUrl);
        }

        setMode('result');
      } else {
        throw new Error(res.error || 'Failed to analyze crop photo.');
      }
    } catch (err) {
      console.error('Scan request error:', err);
      setError(err.message || 'AI diagnosis failed. Please check your internet or retry.');
      setMode('preview');
    }
  };

  // Reset and scan again
  const handleScanAgain = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsSaved(false);
    setMode('select');
  };

  // Save scan handler
  const handleSaveScan = async () => {
    if (!analysisResult) return;

    if (!user) {
      // Guest user: save pending scan in localStorage and prompt auth modal
      setPendingScan(analysisResult, previewUrl);
      setShowAuthModal(true);
      return;
    }

    setSaving(true);
    try {
      const res = await saveScanApi({
        fullResult: analysisResult,
        imageFile: imageFile,
        imageBase64: !imageFile ? previewUrl : undefined
      });

      if (res.success) {
        setIsSaved(true);
        showToast('Scan saved to your account history!', 'success');
      } else {
        throw new Error(res.error || 'Could not save scan');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save scan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col p-5 space-y-5">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {mode !== 'select' && (
            <button
              onClick={handleScanAgain}
              className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-900">
            {mode === 'result' ? 'Diagnosis Result' : 'Scan Crop'}
          </h1>
        </div>

        {/* Crop Selector dropdown */}
        <div className="relative">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            disabled={mode === 'scanning'}
            className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
          >
            <option value="Auto Detect">🌱 Auto Detect Crop</option>
            {SUPPORTED_CROPS.map((crop) => (
              <option key={crop.id} value={crop.name}>
                {crop.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <p className="text-[11px] text-rose-600 mt-0.5">
              Please ensure clear lighting and that the crop organ is centered in frame.
            </p>
          </div>
        </div>
      )}

      {/* STATE 1: Live Camera Viewfinder */}
      {mode === 'camera' && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={() => setMode('select')}
          onFallbackToFile={() => cameraInputRef.current?.click()}
        />
      )}

      {/* STATE 2: Image Selection Options (Take Photo or Upload) */}
      {mode === 'select' && (
        <div className="space-y-4">
          
          {/* Main Option A: Take Live Photo */}
          <button
            onClick={() => setMode('camera')}
            className="w-full p-6 bg-gradient-to-br from-agri-600 to-agri-800 hover:from-agri-700 hover:to-agri-900 text-white rounded-3xl shadow-lg shadow-agri-800/25 flex flex-col items-center justify-center space-y-3 group active:scale-[0.98] transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-base font-bold">Take Photo with Camera</h2>
              <p className="text-xs text-agri-100 mt-0.5">
                Rear camera with live aiming reticle
              </p>
            </div>
          </button>

          {/* Main Option B: Upload from Gallery / Storage */}
          <div
            onClick={() => filePickerRef.current?.click()}
            className="w-full p-6 bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-agri-500 rounded-3xl cursor-pointer flex flex-col items-center justify-center space-y-3 group active:scale-[0.98] transition-all shadow-sm"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-agri-50 group-hover:text-agri-700 transition-colors">
              <Upload className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h2 className="text-sm font-bold text-slate-800">Upload Crop Photo</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports JPG, PNG, WEBP (auto-compressed)
              </p>
            </div>
          </div>

          {/* Hidden HTML5 File Inputs */}
          {/* 1. File picker */}
          <input
            ref={filePickerRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
            }}
          />

          {/* 2. Direct Camera input fallback with capture attribute */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
            }}
          />

          {/* Crop part reminder info */}
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <span>🌾</span>
              <span>What organs can you scan?</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              CropScan AI diagnoses leaves, maize cobs, millet heads, sorghum panicles, tomato fruits, and stems.
            </p>
          </div>
        </div>
      )}

      {/* STATE 3: Preview Before Scanning */}
      {mode === 'preview' && previewUrl && (
        <div className="space-y-4 animate-in fade-in">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
            <img
              src={previewUrl}
              alt="Crop preview"
              className="w-full h-full object-cover"
            />
            {/* Target Crop Indicator Tag */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              Target: {selectedCrop}
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={startScan}
              className="w-full py-4 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-agri-600/30 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>Diagnose Crop with AI</span>
            </button>

            <button
              onClick={handleScanAgain}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200 active:scale-[0.98] transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Choose Another Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 4: Animated Scanning State */}
      {mode === 'scanning' && (
        <ScanningOverlay
          imagePreviewUrl={previewUrl}
          cropName={selectedCrop}
        />
      )}

      {/* STATE 5: Diagnosis Result View */}
      {mode === 'result' && analysisResult && (
        <ResultCard
          result={analysisResult}
          imageUrl={previewUrl}
          onScanAgain={handleScanAgain}
          onSave={handleSaveScan}
          isSaved={isSaved}
          saving={saving}
        />
      )}

      {/* Friendly Auth Modal Prompt for Guests */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Save Your Scan Result"
        subtitle="Create a free farmer account to permanently save this diagnosis to your farm history."
      />

    </div>
  );
}
