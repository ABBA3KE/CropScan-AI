'use client';

/**
 * Crop Guide Index Screen
 * Provides field guides for the 5 supported crops and their common diseases.
 */

import React from 'react';
import Link from 'next/link';
import { SUPPORTED_CROPS } from '../../lib/crops.config';
import { Sprout, BookOpen, ChevronRight, ShieldCheck, Camera } from 'lucide-react';

export default function CropGuidePage() {
  return (
    <div className="w-full flex flex-col p-5 space-y-5">
      
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-agri-600" />
          <h1 className="text-lg font-bold text-slate-900">Crop Pathology Guide</h1>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Comprehensive field identification, symptoms, and control measures for the 5 target crops across Nigeria.
        </p>
      </div>

      {/* Crop Cards */}
      <div className="space-y-3.5">
        {SUPPORTED_CROPS.map((crop) => (
          <div
            key={crop.id}
            className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {crop.iconEmoji}
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {crop.name}
                  </h2>
                  <p className="text-xs text-slate-400 italic">
                    {crop.scientificName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {crop.localNames}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {crop.description}
            </p>

            {/* Target organs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                Organs:
              </span>
              {crop.parts.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Diseases preview pills */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                Common Conditions ({crop.diseases.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {crop.diseases.map((d) => (
                  <span
                    key={d.id}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-agri-50 text-agri-800 border border-agri-200"
                  >
                    {d.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Link
                href={`/crops/${crop.id}`}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Disease Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/scan`}
                className="py-2.5 px-3 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
