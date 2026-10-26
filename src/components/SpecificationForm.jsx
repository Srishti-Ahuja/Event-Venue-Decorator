import React from 'react';
import {
  Wand2,
  Palette,
  Sparkles,
  PartyPopper,
  Flame,
  Crown,
  Zap,
  Lightbulb,
  Sun,
  FileText,
  HelpCircle
} from 'lucide-react';
import {
  CELEBRATION_TYPES,
  AESTHETIC_STYLES,
  COLOR_PALETTES,
  LIGHTING_OPTIONS
} from '../services/templates';

const LIGHTING_ICONS = {
  Sparkles,
  Crown,
  Flame,
  Zap,
  Lightbulb,
  Sun
};

export function SpecificationForm({
  specifications,
  onChange,
  onGenerate,
  isLoading = false,
  statusMessage = '',
  renderMode = 'inPlace',
  onRenderModeChange
}) {
  const handleChange = (field, value) => {
    onChange({
      ...specifications,
      [field]: value
    });
  };

  const handleInsertTag = (tagText) => {
    const existing = specifications.customNotes || '';
    const updated = existing ? `${existing.trim()} ${tagText}` : tagText;
    handleChange('customNotes', updated);
  };

  return (
    <section aria-labelledby="specs-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="specs-heading" className="text-base font-bold text-white flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-hotpink-500 animate-pulse" />
          <span>2. Event Vision & Decor Specifications</span>
        </h2>
        <span className="text-xs text-slate-400">Step 2 of 2</span>
      </div>

      <div className="rounded-2xl glass-panel p-4 sm:p-5 border border-pink-500/20 space-y-4 bg-charcoal-800/80">
        
        {/* Celebration Type & Aesthetic Style (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Celebration Type */}
          <div>
            <label
              htmlFor="celebration-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center space-x-1.5"
            >
              <PartyPopper className="w-3.5 h-3.5 text-hotpink-400" />
              <span>Celebration Type</span>
            </label>
            <select
              id="celebration-select"
              value={specifications.celebrationType}
              onChange={(e) => handleChange('celebrationType', e.target.value)}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-pink-500/20 text-white text-xs sm:text-sm focus-ring cursor-pointer"
            >
              {CELEBRATION_TYPES.map((type) => (
                <option key={type} value={type} className="bg-charcoal-900 text-white">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Aesthetic Style */}
          <div>
            <label
              htmlFor="style-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-hotpink-400" />
              <span>Aesthetic Style</span>
            </label>
            <select
              id="style-select"
              value={specifications.aestheticStyle}
              onChange={(e) => handleChange('aestheticStyle', e.target.value)}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-pink-500/20 text-white text-xs sm:text-sm focus-ring cursor-pointer"
            >
              {AESTHETIC_STYLES.map((style) => (
                <option key={style.id} value={style.label} className="bg-charcoal-900 text-white">
                  {style.label} — {style.desc}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Color Palette Swatches */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-hotpink-400" />
              <span>Color Palette Theme</span>
            </span>
            <span className="text-hotpink-400 font-medium text-xs">
              {specifications.colorPalette}
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {COLOR_PALETTES.map((palette) => {
              const isSelected = specifications.colorPalette === palette.name;
              return (
                <button
                  key={palette.name}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleChange('colorPalette', palette.name)}
                  aria-pressed={isSelected}
                  className={`p-2 rounded-xl text-left border transition-all duration-150 focus-ring ${
                    isSelected
                      ? 'bg-charcoal-900 border-hotpink-500 shadow-pink-glow-sm ring-1 ring-hotpink-500'
                      : 'bg-charcoal-900/60 border-white/10 hover:border-pink-500/30 hover:bg-charcoal-900'
                  }`}
                >
                  {/* Swatches dots */}
                  <div className="flex items-center space-x-1 mb-1.5">
                    {palette.swatches.map((hex, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold text-white truncate">
                    {palette.name.split('&')[0]}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {palette.tag}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Lighting Options */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-1.5">
            <Sun className="w-3.5 h-3.5 text-hotpink-400" />
            <span>Primary Lighting Atmosphere</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {LIGHTING_OPTIONS.map((opt) => {
              const isSelected = specifications.primaryLighting === opt.label;
              const IconComp = LIGHTING_ICONS[opt.icon] || Sparkles;

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleChange('primaryLighting', opt.label)}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-150 focus-ring ${
                    isSelected
                      ? 'bg-hotpink-500/15 border-hotpink-500 text-white shadow-pink-glow-sm'
                      : 'bg-charcoal-900/60 border-white/10 text-slate-300 hover:text-white hover:border-pink-500/30'
                  }`}
                >
                  <IconComp className={`w-4 h-4 mb-1 ${isSelected ? 'text-hotpink-400' : 'text-slate-400'}`} />
                  <span className="text-[11px] font-medium leading-tight">
                    {opt.label.split('&')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Notes & Demands */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="custom-notes"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-hotpink-400" />
              <span>Custom Decor Notes & Focal Elements</span>
            </label>
            <span className="text-[11px] text-slate-500">
              {(specifications.customNotes || '').length}/500 chars
            </span>
          </div>

          <textarea
            id="custom-notes"
            rows={2}
            maxLength={500}
            disabled={isLoading}
            value={specifications.customNotes || ''}
            onChange={(e) => handleChange('customNotes', e.target.value)}
            placeholder="e.g. Cascading floral arch at central beams, gold chiavari chairs, floor candle lanterns..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border border-pink-500/20 text-white placeholder-slate-500 text-xs sm:text-sm focus-ring resize-none"
          />

          {/* Quick-insert tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 mr-1">Quick ideas:</span>
            {[
              'Champagne tower table',
              'Draped white chiffon ceiling',
              'Monogram dance floor',
              'Hanging floral chandeliers'
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                disabled={isLoading}
                onClick={() => handleInsertTag(tag)}
                className="px-2 py-0.5 rounded-md text-[10px] bg-charcoal-900 hover:bg-hotpink-500/20 text-slate-300 hover:text-hotpink-300 border border-white/10 hover:border-pink-500/40 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Redecoration Mode Option */}
        <div className="pt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Wand2 className="w-3.5 h-3.5 text-hotpink-400" />
              <span>Redecoration Engine Mode</span>
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onRenderModeChange && onRenderModeChange('inPlace')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                renderMode === 'inPlace'
                  ? 'bg-hotpink-500/15 border-hotpink-500 shadow-pink-glow-sm ring-1 ring-hotpink-500/50'
                  : 'bg-charcoal-900/60 border-white/10 hover:border-pink-500/30'
              }`}
            >
              <div className="flex items-center space-x-1.5 font-bold text-white mb-0.5">
                <span className="w-2 h-2 rounded-full bg-hotpink-400" />
                <span>In-Place Room Redecoration</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Decorates your exact uploaded space, keeping walls, windows, and architecture 100% aligned.
              </p>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => onRenderModeChange && onRenderModeChange('imagen3')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                renderMode === 'imagen3'
                  ? 'bg-hotpink-500/15 border-hotpink-500 shadow-pink-glow-sm ring-1 ring-hotpink-500/50'
                  : 'bg-charcoal-900/60 border-white/10 hover:border-pink-500/30'
              }`}
            >
              <div className="flex items-center space-x-1.5 font-bold text-white mb-0.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Conceptual AI Synthesis</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Generates a brand new conceptual event space from scratch using text prompt instructions.
              </p>
            </button>
          </div>
        </div>

        {/* Main Action Trigger */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onGenerate}
            className="w-full relative group overflow-hidden rounded-xl py-3.5 px-6 font-bold text-sm sm:text-base text-white bg-gradient-to-r from-hotpink-600 via-hotpink-500 to-pink-500 hover:from-hotpink-500 hover:to-pink-400 shadow-pink-glow transition-all duration-300 flex items-center justify-center space-x-2 focus-ring disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />

            <Wand2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
            <span>
              {isLoading ? (statusMessage || 'Processing Spatial Layout...') : 'Transform & Redecorate This Venue'}
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
