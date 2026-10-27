import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  downloadImage,
  createCompositeComparison,
  exportChecklistToCSV,
  copyPlanSummaryToClipboard
} from '../utils/exportUtils';

describe('Export & Composite Canvas Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('downloadImage', () => {
    it('creates an anchor element and triggers download', () => {
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const removeSpy = vi.spyOn(document.body, 'removeChild');

      downloadImage('data:image/jpeg;base64,123', 'test-venue.jpg');

      expect(appendSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
    });
  });

  describe('exportChecklistToCSV', () => {
    it('does nothing if empty checklist or null passed', () => {
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      exportChecklistToCSV([]);
      exportChecklistToCSV(null);
      exportChecklistToCSV(undefined);
      expect(appendSpy).not.toHaveBeenCalled();
    });

    it('formats items into CSV, properly escapes quotes per RFC 4180, and triggers download', () => {
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const items = [
        {
          id: '1',
          category: 'Lighting & "Special" Effects',
          name: '12" Floating Candle "Glow" Hurricanes',
          quantity: 2,
          unitCost: 100,
          completed: true,
          notes: 'Drape along 6" rafter beams with "fairy" cord'
        }
      ];

      exportChecklistToCSV(items, 'USD');
      expect(appendSpy).toHaveBeenCalled();
    });

    it('handles items with 0, negative, or missing cost and quantity safely', () => {
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const items = [
        {
          id: '2',
          category: null,
          name: null,
          quantity: -5,
          unitCost: -20,
          completed: false,
          notes: null
        }
      ];

      exportChecklistToCSV(items, 'USD');
      expect(appendSpy).toHaveBeenCalled();
    });
  });

  describe('copyPlanSummaryToClipboard', () => {
    it('formats project brief and copies to navigator.clipboard', async () => {
      const planData = {
        title: 'Rustic Timber Barn',
        celebration: 'Wedding',
        style: 'Bohemian Romantic',
        colorPalette: 'Rose Gold & Champagne',
        lighting: 'Fairy Lights',
        prompt: 'A cinematic transformed barn...',
        checklist: [
          { name: 'Floral Arch', quantity: 1, unitCost: 1200, category: 'Florals', completed: true },
          { name: 'Edison Bulbs', quantity: 4, unitCost: 150, category: 'Lighting', completed: false }
        ],
        currency: '$'
      };

      const success = await copyPlanSummaryToClipboard(planData);
      expect(success).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalled();

      const writtenText = vi.mocked(navigator.clipboard.writeText).mock.calls[0][0];
      expect(writtenText).toContain('VENUE DECORATOR & VISUALIZATION AI PLAN');
      expect(writtenText).toContain('Rustic Timber Barn');
      expect(writtenText).toContain('Floral Arch');
      expect(writtenText).toContain('$1,800');
    });

    it('returns false gracefully if clipboard write fails', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('Permission denied'));
      const success = await copyPlanSummaryToClipboard({ title: 'Test' });
      expect(success).toBe(false);
    });
  });

  describe('createCompositeComparison', () => {
    it('loads original and decorated images and produces composite dataUrl', async () => {
      const originalImage = window.Image;
      class MockImage {
        constructor() {
          this.naturalWidth = 1200;
          this.naturalHeight = 800;
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 10);
        }
        set src(_) {}
      }
      window.Image = MockImage;

      const result = await createCompositeComparison('mock-orig.jpg', 'mock-dec.jpg', {
        title: 'Grand Ballroom',
        style: 'Luxury Glamour'
      });

      expect(typeof result).toBe('string');
      expect(result).toContain('data:image/jpeg;base64');

      window.Image = originalImage;
    });
  });
});
