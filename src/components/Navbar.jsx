import React, { memo } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

export const Navbar = memo(function Navbar({ apiKey, onResetToDefault }) {
  const hasKey = Boolean(apiKey && apiKey.trim().length > 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-500/20 glass-panel backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
        
        {/* Brand Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-hotpink-500 to-hotpink-700 shadow-pink-glow">
            <Sparkles className="w-6 h-6 text-white animate-pulse" aria-hidden="true" />
            <div className="absolute -inset-1 rounded-xl bg-hotpink-500/30 blur-sm -z-10" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center">
                <span>Venue Decorator</span>
                <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-md bg-hotpink-500/20 text-hotpink-400 border border-hotpink-500/30">
                  AI
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Two-Stage Spatial Layout Analysis & Generative Visualization
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Engine Mode Status Pill */}
          <div
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              hasKey
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                : 'bg-warmgold-500/10 text-warmgold-400 border-warmgold-500/30'
            }`}
            title={hasKey ? 'Live Google GenAI Pipeline' : 'Simulation Mode'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasKey ? 'bg-emerald-400 animate-pulse' : 'bg-warmgold-400'
              }`}
            />
            <span>{hasKey ? 'GenAI Live Pipeline' : 'Demo Simulation Mode'}</span>
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onResetToDefault}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors focus-ring border border-white/10"
            title="Reset to default venue presets"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

      </div>
    </header>
  );
});
