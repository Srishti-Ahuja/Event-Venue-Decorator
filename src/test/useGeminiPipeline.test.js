import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeminiPipeline } from '../hooks/useGeminiPipeline';

describe('useGeminiPipeline Hook', () => {
  beforeEach(() => {
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

  it('initializes with default Rustic Barn preset and idle state', () => {
    const { result } = renderHook(() => useGeminiPipeline(''));

    expect(result.current.selectedTemplate.id).toBe('rustic-barn');
    expect(result.current.customVenue).toBeNull();
    expect(result.current.pipelineState.status).toBe('idle');
    expect(result.current.result.originalImage).toBeDefined();
    expect(result.current.result.decoratedImage).toBeDefined();
  });

  it('switches between venue templates cleanly', () => {
    const { result } = renderHook(() => useGeminiPipeline(''));

    act(() => {
      result.current.handleSelectTemplate('grand-ballroom');
    });

    expect(result.current.selectedTemplate.id).toBe('grand-ballroom');
    expect(result.current.specifications.celebrationType).toContain('Gala');
    expect(result.current.specifications.colorPalette).toBe('Emerald & Warm Gold');
  });

  it('sets custom uploaded venue and resets decorated render', () => {
    const { result } = renderHook(() => useGeminiPipeline(''));

    const mockUpload = {
      dataUrl: 'data:image/jpeg;base64,customPhoto',
      base64: 'customPhoto',
      mimeType: 'image/jpeg',
      originalName: 'MyLivingRoom.jpg',
      width: 1920,
      height: 1080,
      sizeKb: 450
    };

    act(() => {
      result.current.handleSetCustomVenue(mockUpload);
    });

    expect(result.current.customVenue).toEqual(mockUpload);
    expect(result.current.selectedTemplate).toBeNull();
    expect(result.current.result.originalImage).toBe('data:image/jpeg;base64,customPhoto');
    expect(result.current.result.decoratedImage).toBeNull();
  });

  it('executes runFullPipeline to completion in simulation mode', async () => {
    const { result } = renderHook(() => useGeminiPipeline(''));

    await act(async () => {
      const success = await result.current.runFullPipeline();
      expect(success).toBe(true);
    });

    expect(result.current.pipelineState.status).toBe('completed');
    expect(result.current.pipelineState.progressPercent).toBe(100);
    expect(result.current.result.decoratedImage).toBeDefined();
    expect(result.current.result.expandedPrompt.length).toBeGreaterThan(10);
  });

  it('updates checklist items through handleUpdateChecklist', () => {
    const { result } = renderHook(() => useGeminiPipeline(''));

    const initialChecklist = result.current.result.checklist;
    const modified = initialChecklist.map((item, idx) =>
      idx === 0 ? { ...item, completed: !item.completed } : item
    );

    act(() => {
      result.current.handleUpdateChecklist(modified);
    });

    expect(result.current.result.checklist[0].completed).toBe(modified[0].completed);
  });

  it('regenerates with refined prompt', async () => {
    const { result } = renderHook(() => useGeminiPipeline(''));

    await act(async () => {
      await result.current.regenerateWithPrompt('Add hanging wisteria and candlelight');
    });

    expect(result.current.pipelineState.status).toBe('completed');
    expect(result.current.result.expandedPrompt).toBe('Add hanging wisteria and candlelight');
  });
});
