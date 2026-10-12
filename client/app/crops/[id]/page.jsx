'use client';

/**
 * Individual Crop Disease Guide
 * Displays target disease descriptions, symptoms, causal pathogens,
 * organic controls, and chemical treatments for a selected crop.
 */

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { SUPPORTED_CROPS } from '../../../lib/crops.config';
import { ArrowLeft, Camera, Leaf, Pill, Sprout, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CropDetailPage() {
  const params = useParams();
  const cropId = params?.id;

  const crop = SUPPORTED_CROPS.find((c) => c.id === cropId);

  if (!crop) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-sm text-slate-500">Crop not found in guide.</p>
        <Link href="/crops" className="text-xs text-agri-700 font-bold underline">
          Back to all crops
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-5 space-y-5 pb-12">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href="/crops"
          className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Crops</span>
        </Link>
        <Link
          href="/scan"
          className="py-1.5 px-3 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Scan {crop.name}</span>
        </Link>
      </div>

      {/* Crop Banner */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            {crop.iconEmoji}
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{crop.name}</h1>
            <p className="text-xs text-slate-400 italic">{crop.scientificName}</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pt-1">
          {crop.description}
        </p>
        <p className="text-[11px] text-slate-500 font-medium">
          Local names: {crop.localNames}
        </p>
      </div>

      {/* Diseases List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
          <span>Target Conditions & Diseases</span>
          <span className="text-xs font-semibold text-agri-700">
            {crop.diseases.length} conditions
          </span>
        </h2>

        <div className="space-y-3">
          {crop.diseases.map((d, index) => (
            <div
              key={d.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-agri-100 text-agri-800 text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{d.name}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 italic pl-7">
                    Category: {d.category}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                {d.summary}
              </p>

              <div className="pl-7 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Detectable via leaf, cob, stem & organ scan
                </span>
                <Link
                  href="/scan"
                  className="text-xs font-bold text-agri-700 hover:text-agri-800 flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Scan</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
