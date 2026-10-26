import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  SlidersHorizontal,
  Columns,
  Eye,
  Maximize2,
  Minimize2,
  Download,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function ComparisonSlider({
  originalImage,
  decoratedImage,
  title = 'Venue Comparison',
  specs = {},
  onDownloadComposite
}) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'sideBySide' | 'toggle'
  const [toggleActive, setToggleActive] = useState(false); // for 'toggle' view
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);

  // Handle slider position calculation
  const updatePositionFromClientX = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percent = Math.round((clamped / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    updatePositionFromClientX(e.clientX);
  };

  // Touch event handlers
  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      updatePositionFromClientX(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        updatePositionFromClientX(e.clientX);
      }
    };
    const handleGlobalMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, updatePositionFromClientX]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    if (viewMode !== 'split') return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen exit via Escape
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  if (!decoratedImage) {
    return (
      <div className="rounded-2xl glass-panel p-6 border border-pink-500/20 bg-charcoal-800/80 text-center space-y-3">
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/40 border border-white/10">
          <img
            src={originalImage}
            alt="Original Bare Venue"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent flex items-end p-4">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-black/70 text-slate-200 border border-white/20 backdrop-blur-sm">
              Original Bare Space (Ready for AI Transformation)
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Click "Generate Decorated Venue Visualization" above to see the AI transformed comparison.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="comparison-slider-heading"
      className="space-y-3.5"
    >
      {/* Header with Title and Mode Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <h2 id="comparison-slider-heading" className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-hotpink-400" />
            <span>Before & After Transformation</span>
          </h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-hotpink-500/20 text-hotpink-400 border border-pink-500/30">
            {viewMode === 'split' ? `${sliderPos}% Split` : viewMode}
          </span>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center space-x-1.5 bg-charcoal-900 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            aria-pressed={viewMode === 'split'}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors focus-ring ${
              viewMode === 'split'
                ? 'bg-hotpink-500 text-white font-medium shadow-pink-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Interactive Split Slider"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            aria-pressed={viewMode === 'sideBySide'}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors focus-ring ${
              viewMode === 'sideBySide'
                ? 'bg-hotpink-500 text-white font-medium shadow-pink-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Dual Side-by-Side View"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by Side</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('toggle')}
            aria-pressed={viewMode === 'toggle'}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors focus-ring ${
              viewMode === 'toggle'
                ? 'bg-hotpink-500 text-white font-medium shadow-pink-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="1-Click Toggle View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Toggle View</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors focus-ring"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Visual Display Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden select-none border border-pink-500/30 shadow-2xl bg-black ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'aspect-[16/9]'
        }`}
      >
        {/* VIEW MODE 1: Interactive Split Slider */}
        {viewMode === 'split' && (
          <div
            tabIndex={0}
            role="slider"
            aria-label="Venue transformation split comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={sliderPos}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onTouchStart={() => setIsDragging(true)}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDragging(false)}
            className="relative w-full h-full cursor-ew-resize focus-ring"
          >
            {/* Background Layer: Decorated Render (AFTER) */}
            <img
              src={decoratedImage}
              alt="AI-Decorated Event Venue Render"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              loading="eager"
            />

            {/* Foreground Layer: Bare Space (BEFORE) clipped to slider position */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={originalImage}
                alt="Bare Venue Space"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  maxWidth: 'none'
                }}
              />
            </div>

            {/* Glowing Vertical Divider Line */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center -translate-x-1/2 z-20"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Divider Glow Line */}
              <div className="w-[3px] h-full bg-hotpink-500 shadow-pink-glow" />

              {/* Central Drag Handle */}
              <div className="absolute w-9 h-9 rounded-full bg-hotpink-500 border-2 border-white shadow-pink-glow-lg flex items-center justify-center text-white cursor-ew-resize">
                <div className="flex items-center space-x-0.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* BEFORE Label Badge (Left Top) */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase bg-black/75 text-slate-200 border border-white/20 backdrop-blur-md shadow-md">
                Bare Venue Space
              </span>
            </div>

            {/* AFTER Label Badge (Right Top) */}
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase bg-hotpink-600/90 text-white border border-pink-400 backdrop-blur-md shadow-pink-glow-sm">
                AI Decorated Render
              </span>
            </div>

            {/* Instruction tooltip on bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-slate-300 border border-white/10 hidden sm:block">
              Drag slider or use ← / → arrow keys to compare
            </div>
          </div>
        )}

        {/* VIEW MODE 2: Dual Side-by-Side View */}
        {viewMode === 'sideBySide' && (
          <div className="grid grid-cols-2 w-full h-full">
            {/* Left: Original */}
            <div className="relative h-full border-r-2 border-hotpink-500 overflow-hidden">
              <img
                src={originalImage}
                alt="Original Bare Venue Space"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-bold uppercase bg-black/80 text-slate-200 border border-white/20">
                Bare Space
              </span>
            </div>

            {/* Right: Decorated */}
            <div className="relative h-full overflow-hidden">
              <img
                src={decoratedImage}
                alt="AI Decorated Render"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-bold uppercase bg-hotpink-600 text-white shadow-pink-glow-sm border border-pink-400">
                AI Decorated
              </span>
            </div>
          </div>
        )}

        {/* VIEW MODE 3: 1-Click Toggle View */}
        {viewMode === 'toggle' && (
          <div
            onClick={() => setToggleActive(!toggleActive)}
            className="relative w-full h-full cursor-pointer group"
          >
            <img
              src={toggleActive ? originalImage : decoratedImage}
              alt={toggleActive ? 'Original Bare Venue Space' : 'AI Decorated Render'}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            
            <div className="absolute top-4 left-4 z-10">
              <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase border backdrop-blur-md ${
                toggleActive
                  ? 'bg-black/80 text-slate-200 border-white/20'
                  : 'bg-hotpink-600 text-white border-pink-400 shadow-pink-glow-sm'
              }`}>
                {toggleActive ? 'Showing: Bare Venue Space' : 'Showing: AI Decorated Render'}
              </span>
            </div>

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-4 py-2 rounded-xl bg-charcoal-900/90 text-white text-xs font-semibold border border-hotpink-500 shadow-pink-glow">
                Click anywhere to flip between bare & decorated
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Action Footer: Download buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <span className="text-slate-400 text-[11px]">
          Rendering powered by Google GenAI Multimodal Pipeline
        </span>

        <div className="flex items-center space-x-2">
          {onDownloadComposite && (
            <button
              type="button"
              onClick={onDownloadComposite}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-hotpink-500/20 text-slate-200 hover:text-white border border-pink-500/30 transition-all focus-ring"
              title="Download Side-by-Side comparison image"
            >
              <Download className="w-3.5 h-3.5 text-hotpink-400" />
              <span>Download Composite Image</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
