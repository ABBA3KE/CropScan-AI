'use client';

/**
 * ResultCard Component
 * Comprehensive display of AI crop pathology analysis.
 * Features diagnosis badges, symptoms, causes, immediate actions,
 * chemical treatments, low-cost organic options, prevention, and sharing.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Share2,
  Bookmark,
  RefreshCw,
  ShieldAlert,
  Sprout,
  Pill,
  Leaf,
  Info,
  Calendar,
  Check
} from 'lucide-react';

export default function ResultCard({
  result,
  imageUrl,
  onScanAgain,
  onSave,
  isSaved = false,
  saving = false
}) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const isHealthy = result.status === 'healthy';
  const isUncertain = result.status === 'uncertain' || result.confidence < 60;
  const isNonPlant = result.isPlant === false;
  const isUnsupported = result.isSupportedCrop === false;

  // Badge styles
  const statusBadge = isNonPlant
    ? { text: 'Not a Plant', bg: 'bg-rose-100 text-rose-800 border-rose-200', icon: AlertTriangle }
    : isUnsupported
    ? { text: 'Unsupported Crop', bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle }
    : isHealthy
    ? { text: 'Healthy Specimen', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2 }
    : isUncertain
    ? { text: 'Uncertain / Low Confidence', bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: HelpCircle }
    : { text: 'Diseased', bg: 'bg-rose-100 text-rose-800 border-rose-300', icon: AlertTriangle };

  const StatusIcon = statusBadge.icon;

  const severityBadgeColors = {
    severe: 'bg-rose-600 text-white',
    moderate: 'bg-amber-500 text-white',
    mild: 'bg-yellow-400 text-slate-900',
    none: 'bg-slate-200 text-slate-700'
  }[result.severity] || 'bg-slate-200 text-slate-700';

  // Share handler
  const handleShare = async () => {
    const text = `CropScan AI Diagnosis for ${result.crop} (${result.plantPart}): ${result.diseaseName} (${result.confidence}% confidence). Status: ${result.status.toUpperCase()}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `CropScan AI - ${result.crop} Diagnosis`,
          text: text,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  return (
    <div className="w-full space-y-4 pb-12 animate-in fade-in duration-300">
      
      {/* 1. Header Specimen Photo & Core Badges */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        {imageUrl && (
          <div className="relative aspect-[16/10] w-full bg-slate-900">
            <img
              src={imageUrl}
              alt={result.diseaseName || 'Scanned crop'}
              className="w-full h-full object-cover"
            />
            {/* Top Crop & Plant Part Tag */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                {result.crop}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-slate-200 backdrop-blur-md border border-white/20 capitalize">
                {result.plantPart}
              </span>
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Status Badge + Severity */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg}`}>
              <StatusIcon className="w-4 h-4" />
              <span>{statusBadge.text}</span>
            </span>

            {result.severity && result.severity !== 'none' && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${severityBadgeColors}`}>
                {result.severity} Severity
              </span>
            )}
          </div>

          {/* Disease Name */}
          <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
            {result.diseaseName}
          </h2>

          {/* Causal Agent & Category */}
          {result.causalAgent && result.causalAgent !== 'N/A' && (
            <p className="text-xs text-slate-500 italic mt-0.5">
              Causal Agent: {result.causalAgent} {result.category && `(${result.category})`}
            </p>
          )}

          {/* Confidence Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600">Diagnosis Confidence</span>
              <span className={result.confidence >= 70 ? 'text-agri-700 font-bold' : 'text-amber-700'}>
                {result.confidence}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  result.confidence >= 75
                    ? 'bg-agri-600'
                    : result.confidence >= 55
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
            {result.imageQualityNote && (
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>{result.imageQualityNote}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Description & Symptoms Observed */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Info className="w-4 h-4 text-agri-600" />
            <span>Pathology Summary</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {result.description}
          </p>
        </div>

        {result.symptomsObserved && result.symptomsObserved.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
              Observed Symptoms
            </h4>
            <ul className="space-y-1.5">
              {result.symptomsObserved.map((sym, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-agri-500 mt-1.5 flex-shrink-0" />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.causes && result.causes.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
              Primary Triggers & Causes
            </h4>
            <ul className="space-y-1.5">
              {result.causes.map((c, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. What To Do Now (Immediate Actions) */}
      {result.immediateActions && result.immediateActions.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Immediate Actions Required</span>
          </h3>
          <ul className="space-y-2">
            {result.immediateActions.map((action, idx) => (
              <li key={idx} className="text-xs text-amber-950 flex items-start gap-2 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Organic & Low-Cost Remedies (Crucial for Smallholders) */}
      {result.organicTreatment && result.organicTreatment.length > 0 && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">Organic & Low-Cost Options</h3>
              <p className="text-[10px] text-emerald-700">Affordable solutions using farm materials</p>
            </div>
          </div>
          <ul className="space-y-2 mt-3">
            {result.organicTreatment.map((item, idx) => (
              <li key={idx} className="text-xs text-emerald-900 flex items-start gap-2 leading-relaxed">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. Chemical Treatments (Agro-dealer Active Ingredients) */}
      {result.chemicalTreatment && result.chemicalTreatment.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-sm">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chemical Treatments</h3>
              <p className="text-[10px] text-slate-500">Local agro-dealer actives & fungicides</p>
            </div>
          </div>
          <ul className="space-y-2 mt-3">
            {result.chemicalTreatment.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Prevention & Seasonal Management */}
      {result.prevention && result.prevention.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-agri-600" />
            <span>Future Prevention & Field Hygiene</span>
          </h3>
          <ul className="space-y-2">
            {result.prevention.map((tip, idx) => (
              <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-agri-500 mt-1.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 7. Differential Diagnosis / Other Possibilities */}
      {result.otherPossibilities && result.otherPossibilities.length > 0 && (
        <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 mb-2">
            Other Potential Conditions
          </h4>
          <div className="space-y-1.5">
            {result.otherPossibilities.map((pos, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-200/60">
                <span className="font-medium">{pos.name}</span>
                <span className="text-[11px] font-semibold text-slate-500">{pos.confidence}% probability</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Agricultural Extension Officer Notice */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-center">
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          🌱 <span className="font-bold">Notice:</span> This diagnosis is AI-generated based on visual traits. For high-value fields or critical outbreaks, please confirm with your local Agricultural Extension Officer (ADP) before applying synthetic chemical controls.
        </p>
      </div>

      {/* 9. Action Buttons: Save, Scan Again, Share */}
      <div className="space-y-2.5 pt-2">
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={isSaved || saving}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
              isSaved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-agri-600 hover:bg-agri-700 text-white shadow-agri-600/30'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-700' : ''}`} />
            <span>{isSaved ? 'Saved in History' : saving ? 'Saving...' : 'Save Result'}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 px-4 rounded-2xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        <button
          onClick={onScanAgain}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-slate-600" />
          <span>Scan Another Crop</span>
        </button>
      </div>
    </div>
  );
}
