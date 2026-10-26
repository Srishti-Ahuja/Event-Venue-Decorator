import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Tag,
  Maximize2,
  RefreshCw,
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';
import { QUICK_MODIFIERS } from '../services/templates';

export function PromptRefiner({
  prompt,
  spatialAnalysis,
  onRegenerate,
  isLoading = false
}) {
  const [editablePrompt, setEditablePrompt] = useState(prompt || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditablePrompt(prompt || '');
  }, [prompt]);

  const handleModifierClick = (modifierText) => {
    const current = editablePrompt.trim();
    if (!current) {
      setEditablePrompt(modifierText);
      return;
    }
    // Append seamlessly
    const separator = current.endsWith('.') ? ' ' : '. ';
    setEditablePrompt(`${current}${separator}${modifierText}.`);
  };

  const handleCopy = async () => {
    if (!editablePrompt) return;
    try {
      await navigator.clipboard.writeText(editablePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const handleTriggerReRender = () => {
    onRegenerate(editablePrompt);
  };

  return (
    <section aria-labelledby="prompt-refiner-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="prompt-refiner-heading" className="text-base font-bold text-white flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-hotpink-400" />
            <span>AI Spatial Analysis & Prompt Refiner</span>
          </h2>
          <p className="text-xs text-slate-400">
            Stage 1 architectural analysis and live prompt modification chips
          </p>
        </div>

        {/* Re-generate button */}
        <button
          type="button"
          disabled={isLoading || !editablePrompt.trim()}
          onClick={handleTriggerReRender}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-hotpink-600 to-hotpink-500 hover:from-hotpink-500 hover:to-hotpink-400 shadow-pink-glow-sm transition-all focus-ring disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Re-rendering...' : 'Refine & Re-render'}</span>
        </button>
      </div>

      {/* Spatial Layout Analysis Card (Stage 1 Output) */}
      {spatialAnalysis && (
        <div className="rounded-2xl glass-panel p-4 border border-pink-500/20 bg-charcoal-800/80 space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
            <Compass className="w-4 h-4 text-hotpink-400" />
            <span>Stage 1: Spatial Geometry & Architectural Anchors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-charcoal-900/70 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                Room Architecture & Clearance
              </span>
              <p className="text-white font-medium">
                {spatialAnalysis.roomType || 'Event Space'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {spatialAnalysis.ceilingHeight || 'High clearance with rigging'}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-charcoal-900/70 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                Structural Rigging Anchors
              </span>
              <ul className="text-slate-300 text-[11px] list-disc list-inside space-y-0.5">
                {Array.isArray(spatialAnalysis.architecturalAnchors)
                  ? spatialAnalysis.architecturalAnchors.slice(0, 3).map((a, i) => (
                      <li key={i} className="truncate">{a}</li>
                    ))
                  : <li>Primary structural beams & pillars</li>}
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-charcoal-900/70 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                Lighting & Surface Reflection
              </span>
              <p className="text-[11px] text-slate-300 line-clamp-2">
                {spatialAnalysis.lightingAnalysis || 'Optimized for low-kelvin warm illumination.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Modifier Chips */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-1.5">
          <Tag className="w-3.5 h-3.5 text-hotpink-400" />
          <span>Quick-Click Style & Atmosphere Modifiers</span>
        </label>

        <div className="flex flex-wrap gap-1.5">
          {QUICK_MODIFIERS.map((mod, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleModifierClick(mod.text)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs bg-charcoal-900/80 hover:bg-hotpink-500/20 text-slate-200 hover:text-hotpink-300 border border-white/10 hover:border-pink-500/40 transition-all focus-ring group"
            >
              <span className="text-hotpink-400 font-bold group-hover:scale-125 transition-transform">+</span>
              <span>{mod.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editable Expanded Prompt Box */}
      <div className="rounded-2xl glass-panel p-4 border border-pink-500/20 bg-charcoal-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="expanded-prompt-text" className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-hotpink-400" />
            <span>Master Generative Synthesis Prompt (Stage 2)</span>
          </label>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500 text-[11px]">
              {editablePrompt.length} chars
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
              title="Copy prompt text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-hotpink-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <textarea
          id="expanded-prompt-text"
          rows={4}
          value={editablePrompt}
          onChange={(e) => setEditablePrompt(e.target.value)}
          disabled={isLoading}
          placeholder="Detailed cinematic prompt generated by gemini-3.8-flash..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-pink-500/20 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus-ring leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <span>
            Click any modifier chip above or edit the prompt directly, then click "Refine & Re-render".
          </span>
        </div>
      </div>
    </section>
  );
}
