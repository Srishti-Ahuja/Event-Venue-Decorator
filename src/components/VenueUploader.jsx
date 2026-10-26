import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, Info, Sparkles, Building, TreePine, Castle, AlertTriangle } from 'lucide-react';
import { VENUE_TEMPLATES } from '../services/templates';
import { processAndCompressImage } from '../utils/sanitize';

const ICONS = {
  'rustic-barn': Building,
  'grand-ballroom': Castle,
  'open-lawn': TreePine
};

export function VenueUploader({
  selectedTemplate,
  customVenue,
  onSelectTemplate,
  onSetCustomVenue,
  disabled = false
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setErrorMessage('');
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG, WebP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds 20MB limit. Please upload a smaller image.');
      return;
    }

    setIsProcessing(true);
    try {
      const processed = await processAndCompressImage(file);
      onSetCustomVenue(processed);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const activeVenueName = customVenue
    ? customVenue.originalName || 'Custom Uploaded Venue'
    : selectedTemplate?.name;

  return (
    <section aria-labelledby="venue-input-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="venue-input-heading" className="text-base font-bold text-white flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-hotpink-500 animate-pulse" />
          <span>1. Venue Space Selection</span>
        </h2>
        <span className="text-xs text-slate-400">Step 1 of 2</span>
      </div>

      {/* Preset Venue Templates Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {VENUE_TEMPLATES.map((tmpl) => {
          const isSelected = !customVenue && selectedTemplate?.id === tmpl.id;
          const IconComponent = ICONS[tmpl.id] || Building;

          return (
            <button
              key={tmpl.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTemplate(tmpl.id)}
              aria-pressed={isSelected}
              className={`relative group rounded-xl p-3 text-left transition-all duration-200 border focus-ring overflow-hidden ${
                isSelected
                  ? 'bg-charcoal-800 border-hotpink-500 shadow-pink-glow-sm ring-1 ring-hotpink-500/50'
                  : 'bg-charcoal-850/80 border-white/10 hover:border-pink-500/40 hover:bg-charcoal-800'
              } disabled:opacity-50`}
            >
              {/* Thumbnail Header */}
              <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2.5 bg-black/40">
                <img
                  src={tmpl.bareImage}
                  alt={`Bare space: ${tmpl.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-transparent to-black/30" />
                
                {/* Badge Category */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-charcoal-900/80 text-hotpink-400 border border-pink-500/30 backdrop-blur-sm">
                  {tmpl.category}
                </span>

                {/* Selected Checkmark */}
                {isSelected && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-hotpink-500 text-white flex items-center justify-center shadow-pink-glow">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                )}
              </div>

              {/* Title & Specs */}
              <div className="flex items-center space-x-1.5 mb-1">
                <IconComponent className="w-4 h-4 text-hotpink-400 shrink-0" />
                <h3 className="text-sm font-semibold text-white group-hover:text-hotpink-300 transition-colors">
                  {tmpl.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {tmpl.tagline}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {tmpl.dimensions}
              </p>
            </button>
          );
        })}
      </div>

      {/* Drag & Drop Custom Venue Uploader */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-hotpink-500 bg-hotpink-500/10 shadow-pink-glow'
            : customVenue
            ? 'border-pink-500/50 bg-charcoal-800/90'
            : 'border-white/15 bg-charcoal-850/60 hover:border-pink-500/40 hover:bg-charcoal-800/80'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload custom venue photo drag and drop area"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />

        {customVenue ? (
          <div className="flex items-center justify-between text-left p-1">
            <div className="flex items-center space-x-3.5">
              <img
                src={customVenue.dataUrl}
                alt="Custom uploaded venue preview"
                className="w-14 h-14 rounded-lg object-cover border border-pink-500/40 shadow-sm"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                    {customVenue.originalName || 'Custom Venue'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-hotpink-500/20 text-hotpink-400 font-medium">
                    Custom Photo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {customVenue.width} x {customVenue.height}px • {customVenue.sizeKb} KB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-hotpink-400 hover:text-white hover:bg-hotpink-500/20 border border-pink-500/30 transition-colors"
            >
              Replace Photo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
            <div className="w-10 h-10 rounded-full bg-hotpink-500/10 border border-pink-500/30 flex items-center justify-center text-hotpink-400">
              <UploadCloud className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Or upload your own bare venue photo
              </p>
              <p className="text-[11px] text-slate-400">
                Drag & drop or click to browse (PNG, JPG up to 20MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-lg">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </section>
  );
}
