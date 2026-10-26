import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { downloadImage, createCompositeComparison, exportChecklistToCSV } from '../utils/exportUtils';

export function ExportModal({
  isOpen,
  onClose,
  originalImage,
  decoratedImage,
  checklist = [],
  venueTitle = 'Venue Decor Transformation',
  specifications = {}
}) {
  const [isGeneratingComposite, setIsGeneratingComposite] = useState(false);
  const [successNote, setSuccessNote] = useState('');

  if (!isOpen) return null;

  const handleDownloadOriginal = () => {
    downloadImage(originalImage, `bare-venue-${Date.now()}.jpg`);
    setSuccessNote('Downloaded bare venue photo.');
    setTimeout(() => setSuccessNote(''), 2500);
  };

  const handleDownloadDecorated = () => {
    downloadImage(decoratedImage, `ai-decorated-render-${Date.now()}.jpg`);
    setSuccessNote('Downloaded AI decorated render.');
    setTimeout(() => setSuccessNote(''), 2500);
  };

  const handleDownloadComposite = async () => {
    setIsGeneratingComposite(true);
    try {
      const dataUrl = await createCompositeComparison(originalImage, decoratedImage, {
        title: venueTitle,
        style: specifications.aestheticStyle
      });
      downloadImage(dataUrl, `venue-before-after-composite-${Date.now()}.png`);
      setSuccessNote('Composite comparison image generated and downloaded.');
      setTimeout(() => setSuccessNote(''), 2500);
    } catch (err) {
      console.error('Composite failed', err);
      // Fallback to decorated image
      downloadImage(decoratedImage, 'venue-render.png');
    } finally {
      setIsGeneratingComposite(false);
    }
  };

  const handleExportCSV = () => {
    exportChecklistToCSV(checklist, 'USD');
    setSuccessNote('Vendor checklist exported to CSV.');
    setTimeout(() => setSuccessNote(''), 2500);
  };

  const handlePrintBrief = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-7 shadow-2xl border border-pink-500/30 bg-[#1A1A22] space-y-5">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-ring"
          aria-label="Close Export Hub"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-hotpink-500/20 border border-hotpink-500/40 flex items-center justify-center text-hotpink-400 shadow-pink-glow-sm">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 id="export-modal-title" className="text-xl font-bold text-white">
              Export & Share Project Hub
            </h2>
            <p className="text-xs text-slate-400">
              Download presentation renders, composite graphics, and vendor spreadsheets
            </p>
          </div>
        </div>

        {/* Success Notice */}
        {successNote && (
          <div className="p-3 rounded-lg text-xs bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Export Options Grid */}
        <div className="space-y-3">
          
          {/* Option 1: Side-by-Side Composite Canvas */}
          <button
            type="button"
            disabled={isGeneratingComposite}
            onClick={handleDownloadComposite}
            className="w-full p-3.5 rounded-xl bg-charcoal-900 border border-pink-500/20 hover:border-hotpink-500 hover:bg-hotpink-500/10 transition-all text-left flex items-center justify-between group focus-ring"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-hotpink-500/20 text-hotpink-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-hotpink-300">
                  {isGeneratingComposite ? 'Generating Composite Canvas...' : 'Side-by-Side Comparison PNG'}
                </p>
                <p className="text-xs text-slate-400">
                  Branded dual graphic with Before/After badges & metadata
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-hotpink-400" />
          </button>

          {/* Option 2: AI Decorated High-Res Render */}
          <button
            type="button"
            onClick={handleDownloadDecorated}
            className="w-full p-3.5 rounded-xl bg-charcoal-900 border border-white/10 hover:border-pink-500/40 hover:bg-hotpink-500/10 transition-all text-left flex items-center justify-between group focus-ring"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-hotpink-300">
                  AI Decorated Render Only (JPEG)
                </p>
                <p className="text-xs text-slate-400">
                  Full resolution final decor visualization
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-hotpink-400" />
          </button>

          {/* Option 3: Vendor Checklist CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full p-3.5 rounded-xl bg-charcoal-900 border border-white/10 hover:border-pink-500/40 hover:bg-hotpink-500/10 transition-all text-left flex items-center justify-between group focus-ring"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-hotpink-300">
                  Vendor Decor Checklist (CSV)
                </p>
                <p className="text-xs text-slate-400">
                  Itemized quantities, unit costs, and placement notes
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-hotpink-400" />
          </button>

          {/* Option 4: Print Project Brief */}
          <button
            type="button"
            onClick={handlePrintBrief}
            className="w-full p-3.5 rounded-xl bg-charcoal-900 border border-white/10 hover:border-pink-500/40 hover:bg-hotpink-500/10 transition-all text-left flex items-center justify-between group focus-ring"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-hotpink-300">
                  Printable Decor Specification Sheet
                </p>
                <p className="text-xs text-slate-400">
                  Print-ready client brief with specs & vendor budget
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-hotpink-400" />
          </button>

        </div>

      </div>
    </div>
  );
}
