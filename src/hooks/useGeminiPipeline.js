import { useState, useCallback } from 'react';
import { VENUE_TEMPLATES } from '../services/templates';
import { runStage1SpatialAnalysis, runStage2VisualGeneration } from '../services/geminiService';

export function useGeminiPipeline(apiKey) {
  // Active venue selection (defaults to Rustic Barn template)
  const [selectedTemplate, setSelectedTemplate] = useState(VENUE_TEMPLATES[0]);
  const [customVenue, setCustomVenue] = useState(null);

  // Specifications
  const [specifications, setSpecifications] = useState(VENUE_TEMPLATES[0].defaultSpecs);

  // Redecoration Mode: 'inPlace' (redecorates exact uploaded room) | 'imagen3' (concept text-to-image)
  const [renderMode, setRenderMode] = useState('inPlace');

  // Pipeline Status
  const [pipelineState, setPipelineState] = useState({
    status: 'idle', // 'idle' | 'stage1' | 'stage2' | 'completed' | 'error'
    currentStage: null,
    progressPercent: 0,
    statusMessage: '',
    error: null,
    errorNotice: null,
    stage1Duration: 0,
    stage2Duration: 0
  });

  // Generated Results
  const [result, setResult] = useState({
    originalImage: VENUE_TEMPLATES[0].bareImage,
    decoratedImage: VENUE_TEMPLATES[0].decoratedImage,
    expandedPrompt: '',
    spatialAnalysis: VENUE_TEMPLATES[0].spatialAnalysis,
    checklist: VENUE_TEMPLATES[0].checklist,
    isSimulated: true,
    lastGeneratedAt: null
  });

  // Switch between presets
  const handleSelectTemplate = useCallback((templateId) => {
    const found = VENUE_TEMPLATES.find((t) => t.id === templateId);
    if (!found) return;

    setSelectedTemplate(found);
    setCustomVenue(null);
    setSpecifications(found.defaultSpecs);
    setResult({
      originalImage: found.bareImage,
      decoratedImage: found.decoratedImage,
      expandedPrompt: '',
      spatialAnalysis: found.spatialAnalysis,
      checklist: found.checklist,
      isSimulated: true,
      lastGeneratedAt: null
    });
    setPipelineState({
      status: 'idle',
      currentStage: null,
      progressPercent: 0,
      statusMessage: '',
      error: null,
      errorNotice: null,
      stage1Duration: 0,
      stage2Duration: 0
    });
  }, []);

  // Set custom uploaded image
  const handleSetCustomVenue = useCallback((uploadedData) => {
    setCustomVenue(uploadedData);
    setSelectedTemplate(null);
    setResult((prev) => ({
      ...prev,
      originalImage: uploadedData.dataUrl,
      decoratedImage: null, // cleared so user generates fresh redecoration of their image
      lastGeneratedAt: null
    }));
  }, []);

  // Run full two-stage pipeline
  const runFullPipeline = useCallback(async () => {
    const startTime = Date.now();
    let stage1EndTime = 0;

    const activeImageBase64 = customVenue ? customVenue.base64 : null;
    const activeMimeType = customVenue ? customVenue.mimeType : 'image/jpeg';
    const activeOriginalUrl = customVenue ? customVenue.dataUrl : (selectedTemplate?.bareImage || VENUE_TEMPLATES[0].bareImage);
    const venueName = customVenue ? customVenue.originalName || 'Custom Uploaded Venue' : (selectedTemplate?.name || 'Event Space');
    const templateId = selectedTemplate?.id || null;

    setPipelineState({
      status: 'stage1',
      currentStage: 1,
      progressPercent: 15,
      statusMessage: 'Stage 1: Spatial layout & architectural analysis in progress...',
      error: null,
      errorNotice: null,
      stage1Duration: 0,
      stage2Duration: 0
    });

    try {
      // STAGE 1: Spatial Analysis with gemini-2.5-flash
      const stage1Result = await runStage1SpatialAnalysis({
        apiKey,
        imageBase64: activeImageBase64,
        mimeType: activeMimeType,
        specifications,
        venueTitle: venueName,
        onProgress: (prog) => {
          setPipelineState((prev) => ({
            ...prev,
            statusMessage: `Stage 1: ${prog.step}`,
            progressPercent: Math.round(prog.percent * 0.5)
          }));
        }
      });

      stage1EndTime = Date.now();
      const stage1Duration = ((stage1EndTime - startTime) / 1000).toFixed(1);

      // STAGE 2: In-Place Venue Redecoration or Visual Generation
      setPipelineState((prev) => ({
        ...prev,
        status: 'stage2',
        currentStage: 2,
        progressPercent: 55,
        statusMessage: 'Stage 2: Redecorating uploaded venue with synthesized decor...',
        stage1Duration
      }));

      const stage2Result = await runStage2VisualGeneration({
        apiKey,
        prompt: stage1Result.expandedPrompt,
        originalImageSrc: activeOriginalUrl,
        venueTemplateId: templateId,
        specifications,
        renderMode,
        onProgress: (prog) => {
          setPipelineState((prev) => ({
            ...prev,
            statusMessage: `Stage 2: ${prog.step}`,
            progressPercent: 50 + Math.round(prog.percent * 0.5)
          }));
        }
      });

      const totalEndTime = Date.now();
      const stage2Duration = ((totalEndTime - stage1EndTime) / 1000).toFixed(1);

      // Save complete result
      setResult({
        originalImage: activeOriginalUrl,
        decoratedImage: stage2Result.imageUrl,
        expandedPrompt: stage1Result.expandedPrompt,
        spatialAnalysis: stage1Result.spatialAnalysis,
        checklist: stage1Result.checklist,
        isSimulated: stage1Result.isSimulated || stage2Result.isSimulated,
        lastGeneratedAt: new Date().toLocaleTimeString()
      });

      setPipelineState({
        status: 'completed',
        currentStage: null,
        progressPercent: 100,
        statusMessage: 'Transformation visualization complete!',
        error: null,
        errorNotice: stage1Result.errorNotice || stage2Result.errorNotice || null,
        stage1Duration,
        stage2Duration
      });

      return true;
    } catch (err) {
      console.error('Pipeline execution failed:', err);
      setPipelineState((prev) => ({
        ...prev,
        status: 'error',
        currentStage: null,
        progressPercent: 0,
        statusMessage: 'Failed to complete visualization',
        error: err.message || 'An unexpected error occurred during generation.'
      }));
      return false;
    }
  }, [apiKey, customVenue, selectedTemplate, specifications, renderMode]);

  // Stage 2 Re-generation with Refined Prompt
  const regenerateWithPrompt = useCallback(async (newPrompt) => {
    if (!newPrompt || newPrompt.trim() === '') return;

    const startTime = Date.now();
    const templateId = selectedTemplate?.id || null;
    const activeOriginalUrl = customVenue ? customVenue.dataUrl : (selectedTemplate?.bareImage || VENUE_TEMPLATES[0].bareImage);

    setPipelineState((prev) => ({
      ...prev,
      status: 'stage2',
      currentStage: 2,
      progressPercent: 20,
      statusMessage: 'Re-rendering visual with modified prompt specs...',
      error: null
    }));

    try {
      const stage2Result = await runStage2VisualGeneration({
        apiKey,
        prompt: newPrompt,
        originalImageSrc: activeOriginalUrl,
        venueTemplateId: templateId,
        specifications,
        renderMode,
        onProgress: (prog) => {
          setPipelineState((prev) => ({
            ...prev,
            statusMessage: `Re-rendering: ${prog.step}`,
            progressPercent: prog.percent
          }));
        }
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      setResult((prev) => ({
        ...prev,
        decoratedImage: stage2Result.imageUrl,
        expandedPrompt: newPrompt,
        isSimulated: prev.isSimulated || stage2Result.isSimulated,
        lastGeneratedAt: new Date().toLocaleTimeString()
      }));

      setPipelineState({
        status: 'completed',
        currentStage: null,
        progressPercent: 100,
        statusMessage: 'Refined render generated successfully!',
        error: null,
        errorNotice: stage2Result.errorNotice || null,
        stage1Duration: 0,
        stage2Duration: duration
      });
    } catch (err) {
      console.error('Re-generation failed:', err);
      setPipelineState((prev) => ({
        ...prev,
        status: 'error',
        currentStage: null,
        progressPercent: 0,
        statusMessage: 'Re-generation failed',
        error: err.message || 'Failed to re-render with new prompt'
      }));
    }
  }, [apiKey, customVenue, selectedTemplate, specifications, renderMode]);

  // Update checklist items state
  const handleUpdateChecklist = useCallback((newItems) => {
    setResult((prev) => ({
      ...prev,
      checklist: newItems
    }));
  }, []);

  return {
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
  };
}
