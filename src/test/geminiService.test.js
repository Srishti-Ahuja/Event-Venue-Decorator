import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getGenAIClient,
  runStage1SpatialAnalysis,
  runStage2VisualGeneration,
  generateSimulatedStage1
} from '../services/geminiService';

describe('Gemini Service & Two-Stage Multimodal AI Pipeline', () => {
  beforeEach(() => {
    // Setup Mock Image for In-Place Renderer
    class MockImage {
      constructor() {
        this.naturalWidth = 1200;
        this.naturalHeight = 800;
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 5);
      }
      set src(_) {}
    }
    window.Image = MockImage;
  });

  describe('getGenAIClient', () => {
    it('throws when apiKey is empty or non-string', () => {
      expect(() => getGenAIClient('')).toThrow('Please enter a valid Google Gemini API key');
      expect(() => getGenAIClient(null)).toThrow('Please enter a valid Google Gemini API key');
      expect(() => getGenAIClient(undefined)).toThrow('Please enter a valid Google Gemini API key');
    });

    it('returns a GoogleGenAI instance when apiKey is provided', () => {
      const client = getGenAIClient('test-api-key-123');
      expect(client).toBeDefined();
    });
  });

  describe('runStage1SpatialAnalysis (Simulation & Fallback Mode)', () => {
    const mockSpecs = {
      celebrationType: 'Wedding',
      aestheticStyle: 'Bohemian Romantic',
      colorPalette: 'Rose Gold & Champagne',
      primaryLighting: 'Fairy Lights & Twinkle Canopy',
      customNotes: 'Floral arch at center'
    };

    it('runs simulated Stage 1 when apiKey is empty', async () => {
      const onProgress = vi.fn();
      const result = await runStage1SpatialAnalysis({
        apiKey: '',
        specifications: mockSpecs,
        venueTitle: 'Rustic Barn',
        onProgress
      });

      expect(onProgress).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.isSimulated).toBe(true);
      expect(result.expandedPrompt).toContain('Wedding');
      expect(result.expandedPrompt).toContain('Bohemian Romantic');
      expect(result.spatialAnalysis).toBeDefined();
      expect(result.checklist.length).toBeGreaterThan(0);
    });

    it('generates simulated spatial layout analysis with architectural anchors', () => {
      const sim = generateSimulatedStage1('Ballroom', mockSpecs);
      expect(sim.spatialAnalysis.roomType).toBe('Ballroom');
      expect(sim.spatialAnalysis.architecturalAnchors.length).toBe(3);
      expect(sim.checklist.length).toBe(8);
    });
  });

  describe('runStage2VisualGeneration', () => {
    const mockSpecs = {
      celebrationType: 'Wedding',
      aestheticStyle: 'Bohemian Romantic',
      colorPalette: 'Rose Gold & Champagne',
      primaryLighting: 'Fairy Lights & Twinkle Canopy'
    };

    it('runs in-place redecoration on uploaded venue photo when mode is inPlace', async () => {
      const onProgress = vi.fn();
      const result = await runStage2VisualGeneration({
        apiKey: '',
        prompt: 'Romantic wedding with fairy lights',
        originalImageSrc: 'data:image/jpeg;base64,mockOriginalImage',
        specifications: mockSpecs,
        renderMode: 'inPlace',
        onProgress
      });

      expect(onProgress).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.imageUrl).toMatch(/^data:image\/jpeg/);
      expect(result.isSimulated).toBe(true);
    });

    it('falls back to template decorated image if originalImageSrc is absent', async () => {
      const result = await runStage2VisualGeneration({
        apiKey: '',
        prompt: 'Wedding',
        originalImageSrc: null,
        venueTemplateId: 'rustic-barn',
        specifications: mockSpecs,
        renderMode: 'inPlace'
      });

      expect(result).toBeDefined();
      expect(result.imageUrl).toContain('unsplash.com');
    });
  });
});
