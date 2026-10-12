'use client';

/**
 * ScanningOverlay Component
 * Renders high-tech agricultural scanning animation with sweeping laser bar,
 * pulsing AI reticle, and rotating diagnostic status updates.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Activity } from 'lucide-react';

const SCAN_STEPS = [
  'Examining plant organs and foliage...',
  'Analyzing lesion patterns and discoloration...',
  'Matching against Nigerian crop pathology database...',
  'Evaluating pathogen type & disease severity...',
  'Compiling organic & chemical treatment remedies...'
];

export default function ScanningOverlay({ imagePreviewUrl, cropName = 'Crop' }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden aspect-[4/5] bg-slate-950 shadow-2xl flex flex-col justify-between border border-agri-600/30">
      {/* Background Image being scanned */}
      {imagePreviewUrl ? (
        <img
          src={imagePreviewUrl}
          alt="Scanning crop"
          className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-90 contrast-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-agri-950 opacity-90" />
      )}

      {/* Cyber-Agricultural Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#22c55e10_1px,transparent_1px),linear-gradient(to_bottom,#22c55e10_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Sweeping Laser Line Animation */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-agri-400 to-transparent shadow-[0_0_16px_#4ade80] animate-scan-laser pointer-events-none z-20" />

      {/* Corner targeting brackets */}
      <div className="absolute inset-6 pointer-events-none z-10 flex flex-col justify-between">
        <div className="flex justify-between">
          <span className="w-6 h-6 border-t-2 border-l-2 border-agri-400 shadow-sm" />
          <span className="w-6 h-6 border-t-2 border-r-2 border-agri-400 shadow-sm" />
        </div>
        <div className="flex justify-between">
          <span className="w-6 h-6 border-b-2 border-l-2 border-agri-400 shadow-sm" />
          <span className="w-6 h-6 border-b-2 border-r-2 border-agri-400 shadow-sm" />
        </div>
      </div>

      {/* Top AI Badge */}
      <div className="relative z-20 p-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 text-agri-300 border border-agri-500/30 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Gemini AI Pathology Engine</span>
        </span>
        <span className="text-[11px] font-semibold text-white/70 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md">
          Target: {cropName}
        </span>
      </div>

      {/* Center Reticle Pulse */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative w-28 h-28 rounded-full border-2 border-agri-400/40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-agri-300 animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-full bg-agri-500/20 backdrop-blur-sm flex items-center justify-center border border-agri-400/60 shadow-lg">
            <Activity className="w-8 h-8 text-agri-300 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="relative z-20 p-5 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent">
        <div className="bg-black/70 border border-slate-700/60 rounded-2xl p-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agri-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-agri-500" />
            </span>
            <span className="text-xs font-semibold text-agri-300 uppercase tracking-wider">
              Diagnosing Specimen
            </span>
          </div>
          <p className="text-xs text-white font-medium transition-all duration-300 min-h-[32px] flex items-center">
            {SCAN_STEPS[stepIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
