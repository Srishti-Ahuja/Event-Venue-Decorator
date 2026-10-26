import React from 'react';
import { Sparkles, Scan, Image as ImageIcon, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function PipelineStatus({ pipelineState }) {
  const {
    status,
    currentStage,
    progressPercent,
    statusMessage,
    error,
    errorNotice,
    stage1Duration,
    stage2Duration
  } = pipelineState;

  if (status === 'idle') return null;

  const isStage1Active = status === 'stage1';
  const isStage1Done = status === 'stage2' || status === 'completed';
  const isStage2Active = status === 'stage2';
  const isStage2Done = status === 'completed';

  return (
    <div
      aria-live="polite"
      className="rounded-2xl glass-panel p-4 sm:p-5 border border-pink-500/30 bg-charcoal-800/90 shadow-pink-glow-sm space-y-3.5 animate-fadeIn"
    >
      {/* Header with Title and Overall Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-hotpink-400 animate-spin" style={{ animationDuration: '4s' }} />
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Multimodal Two-Stage Generation Pipeline
          </h3>
        </div>
        
        <span className="text-xs font-mono text-hotpink-400 font-semibold">
          {progressPercent}%
        </span>
      </div>

      {/* Two-Stage Visual Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Stage 1: Spatial Analysis */}
        <div
          className={`p-3 rounded-xl border transition-all duration-200 flex items-center space-x-3 ${
            isStage1Active
              ? 'bg-hotpink-500/15 border-hotpink-500 shadow-pink-glow-sm ring-1 ring-hotpink-500/40'
              : isStage1Done
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-charcoal-900/60 border-white/10 opacity-50'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isStage1Active
                ? 'bg-hotpink-500 text-white animate-pulse'
                : isStage1Done
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-charcoal-800 text-slate-500'
            }`}
          >
            {isStage1Done ? <CheckCircle2 className="w-5 h-5" /> : <Scan className="w-5 h-5" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white truncate">
                Stage 1: Spatial Layout Analysis
              </p>
              {stage1Duration > 0 && (
                <span className="text-[10px] text-slate-400 flex items-center space-x-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{stage1Duration}s</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              gemini-3.8-flash geometry & lighting scan
            </p>
          </div>
        </div>

        {/* Stage 2: Generative Rendering */}
        <div
          className={`p-3 rounded-xl border transition-all duration-200 flex items-center space-x-3 ${
            isStage2Active
              ? 'bg-hotpink-500/15 border-hotpink-500 shadow-pink-glow-sm ring-1 ring-hotpink-500/40'
              : isStage2Done
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-charcoal-900/60 border-white/10 opacity-50'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isStage2Active
                ? 'bg-hotpink-500 text-white animate-pulse'
                : isStage2Done
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-charcoal-800 text-slate-500'
            }`}
          >
            {isStage2Done ? <CheckCircle2 className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white truncate">
                Stage 2: Generative Visual Rendering
              </p>
              {stage2Duration > 0 && (
                <span className="text-[10px] text-slate-400 flex items-center space-x-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{stage2Duration}s</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              imagen-3.0 volumetric photorealism
            </p>
          </div>
        </div>

      </div>

      {/* Progress Bar */}
      <div className="w-full bg-charcoal-950 rounded-full h-2 overflow-hidden border border-white/5">
        <div
          className="bg-gradient-to-r from-hotpink-600 to-hotpink-400 h-full rounded-full transition-all duration-300 shadow-pink-glow-sm"
          style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
        />
      </div>

      {/* Real-time Status Message */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-300 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-hotpink-400 animate-ping" />
          <span className="truncate">{statusMessage}</span>
        </div>
        {status === 'completed' && (
          <span className="text-emerald-400 font-semibold shrink-0 ml-2">Ready</span>
        )}
      </div>

      {/* Fallback Notice or API Warning */}
      {errorNotice && (
        <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Fatal Error */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
