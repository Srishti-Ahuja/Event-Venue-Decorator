import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { BackgroundBokeh } from './components/BackgroundBokeh';
import { Navbar } from './components/Navbar';
import { VenueUploader } from './components/VenueUploader';
import { SpecificationForm } from './components/SpecificationForm';
import { PipelineStatus } from './components/PipelineStatus';
import { ComparisonSlider } from './components/ComparisonSlider';
import { DecorChecklist } from './components/DecorChecklist';
import { PromptRefiner } from './components/PromptRefiner';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGeminiPipeline } from './hooks/useGeminiPipeline';
import { ToastProvider } from './context/ToastContext';
import { Sparkles, Download, Wand2, Shield, Heart } from 'lucide-react';

const ApiKeyModal = lazy(() => import('./components/ApiKeyModal').then(m => ({ default: m.ApiKeyModal })));
const ExportModal = lazy(() => import('./components/ExportModal').then(m => ({ default: m.ExportModal })));

export default function App() {
  // Read API key from environment variable first, with localStorage fallback
  const envApiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  const [localApiKey, setLocalApiKey] = useLocalStorage('venue_decorator_gemini_api_key', '');
  
  // Active API key prioritizes the environment variable
  const apiKey = envApiKey || localApiKey;
  const isEnvKey = Boolean(envApiKey);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const {
    selectedTemplate,
    customVenue,
    specifications,
    setSpecifications,
    renderMode,
    setRenderMode,
    pipelineState,
    result,
    handleSelectTemplate,
    handleSetCustomVenue,
    runFullPipeline,
    regenerateWithPrompt,
    handleUpdateChecklist
  } = useGeminiPipeline(apiKey);

  const activeVenueTitle = useMemo(() => {
    return customVenue
      ? customVenue.originalName || 'Custom Uploaded Venue'
      : selectedTemplate?.name || 'Venue Space';
  }, [customVenue, selectedTemplate]);

  const handleResetToDefault = useCallback(() => {
    handleSelectTemplate('rustic-barn');
  }, [handleSelectTemplate]);

  const isGenerating = useMemo(() => {
    return pipelineState.status === 'stage1' || pipelineState.status === 'stage2';
  }, [pipelineState.status]);

  return (
    <ToastProvider>
      <div className="relative min-h-screen text-slate-100 flex flex-col selection:bg-hotpink-500 selection:text-white">
        {/* Background Animated Bokeh & Fairy-Light Atmosphere */}
        <BackgroundBokeh />

        {/* WCAG 2.4.1 Accessible Skip-To-Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-hotpink-600 focus:text-white focus:rounded-xl focus:shadow-pink-glow focus:font-semibold focus:text-xs focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>

        {/* Visually Hidden Screen Reader Status Announcer */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {pipelineState.statusMessage}
        </div>

        {/* Header Landmark */}
        <Navbar
          apiKey={apiKey}
          onResetToDefault={handleResetToDefault}
        />

        {/* Main Landmark */}
        <main
          id="main-content"
          tabIndex={-1}
          className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 outline-none"
        >
        
        {/* Hero Title Section */}
        <section aria-labelledby="hero-title" className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-hotpink-500/15 text-hotpink-400 border border-hotpink-500/30 backdrop-blur-sm shadow-pink-glow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Two-Stage AI Transformation Engine</span>
          </div>

          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            Transform Any Bare Venue Into A{' '}
            <span className="text-gradient-pink">Breathtaking Masterpiece</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Multimodal spatial geometry scanning via <span className="text-slate-200 font-medium">gemini-3.8-flash</span> coupled with in-place architectural redecoration & visual synthesis.
          </p>
        </section>

        {/* Top Split Workflow Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* LEFT COLUMN: Input & Specifications Controls (5 Cols) */}
          <aside
            aria-label="Venue and Specification Controls"
            className="lg:col-span-5 space-y-6"
          >
            {/* Step 1: Venue Space Selection */}
            <VenueUploader
              selectedTemplate={selectedTemplate}
              customVenue={customVenue}
              onSelectTemplate={handleSelectTemplate}
              onSetCustomVenue={handleSetCustomVenue}
              disabled={isGenerating}
            />

            {/* Step 2: Event Vision & Specifications Form */}
            <SpecificationForm
              specifications={specifications}
              onChange={setSpecifications}
              onGenerate={runFullPipeline}
              isLoading={isGenerating}
              statusMessage={pipelineState.statusMessage}
              renderMode={renderMode}
              onRenderModeChange={setRenderMode}
            />
          </aside>

          {/* RIGHT COLUMN: Interactive AI Output & Visualizer (7 Cols) */}
          <section
            aria-label="AI Visualization and Analysis Workspace"
            className="lg:col-span-7 space-y-6"
          >
            {/* Stage Progress Stepper (Active during and after generation) */}
            <PipelineStatus pipelineState={pipelineState} />

            {/* Feature 1: Interactive Drag-Split Comparison Slider */}
            <ComparisonSlider
              originalImage={result.originalImage}
              decoratedImage={result.decoratedImage}
              title={activeVenueTitle}
              specs={specifications}
              onDownloadComposite={() => setIsExportModalOpen(true)}
            />

            {/* Feature 3: AI Spatial Breakdown & Prompt Refiner */}
            <PromptRefiner
              prompt={result.expandedPrompt || `A breathtaking, lavishly decorated ${specifications.celebrationType} inside ${activeVenueTitle}, designed in a ${specifications.aestheticStyle} aesthetic with ${specifications.primaryLighting}.`}
              spatialAnalysis={result.spatialAnalysis}
              onRegenerate={regenerateWithPrompt}
              isLoading={isGenerating}
            />

            {/* Feature 2: Itemized Vendor Decor Checklist */}
            <DecorChecklist
              checklist={result.checklist}
              onUpdateChecklist={handleUpdateChecklist}
              venueTitle={activeVenueTitle}
              specifications={specifications}
              expandedPrompt={result.expandedPrompt}
            />
          </section>

        </div>

      </main>

      {/* Footer Landmark */}
      <footer className="relative z-10 border-t border-pink-500/20 bg-charcoal-900/90 backdrop-blur-md py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-hotpink-500" />
            <span className="font-semibold text-slate-200">Venue Decorator & Visualization AI</span>
            <span>• Powered by Google GenAI</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(true)}
              className="text-hotpink-400 hover:text-hotpink-300 transition-colors focus-ring"
            >
              API Key Settings
            </button>
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="text-slate-300 hover:text-white transition-colors focus-ring flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5 text-hotpink-400" />
              <span>Export Hub</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Lazy-Loaded Dialog Modals */}
      <Suspense fallback={null}>
        {isApiKeyModalOpen && (
          <ApiKeyModal
            isOpen={isApiKeyModalOpen}
            onClose={() => setIsApiKeyModalOpen(false)}
            currentKey={apiKey}
            onSaveKey={setLocalApiKey}
            isEnvKey={isEnvKey}
          />
        )}

        {isExportModalOpen && (
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            originalImage={result.originalImage}
            decoratedImage={result.decoratedImage}
            checklist={result.checklist}
            venueTitle={activeVenueTitle}
            specifications={specifications}
          />
        )}
      </Suspense>

      </div>
    </ToastProvider>
  );
}
