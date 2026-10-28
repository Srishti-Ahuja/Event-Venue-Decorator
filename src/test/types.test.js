import { describe, it, expect } from 'vitest';
import { validateSpecifications, validateChecklistItem } from '../types/index.js';

describe('Architectural Data Contracts & Runtime Schema Validators', () => {
  describe('validateSpecifications', () => {
    it('returns standard safe defaults when null or non-object passed', () => {
      const fallback = validateSpecifications(null);
      expect(fallback.celebrationType).toBe('Wedding Ceremony & Reception');
      expect(fallback.aestheticStyle).toBe('Bohemian Romantic');
      expect(fallback.colorPalette).toBe('Rose Gold & Champagne');
      expect(fallback.primaryLighting).toBe('Fairy Lights & Twinkle Canopy');
      expect(fallback.customNotes).toBe('');

      expect(validateSpecifications(undefined).celebrationType).toBe('Wedding Ceremony & Reception');
      expect(validateSpecifications('string').celebrationType).toBe('Wedding Ceremony & Reception');
    });

    it('sanitizes malicious scripts and code fences in customNotes and specifications fields', () => {
      const malicious = {
        celebrationType: '<script>alert("hack")</script>Gala',
        aestheticStyle: 'Modern```DROP TABLE```',
        colorPalette: 'Hot Pink & Charcoal',
        primaryLighting: 'Neon',
        customNotes: '<b onmouseover=alert(1)>Bold note</b>'
      };

      const sanitized = validateSpecifications(malicious);
      expect(sanitized.celebrationType).toBe('alert("hack")Gala');
      expect(sanitized.aestheticStyle).toBe("Modern'''DROP TABLE'''");
      expect(sanitized.customNotes).toBe('Bold note');
    });

    it('preserves valid custom fields accurately', () => {
      const valid = {
        celebrationType: 'Corporate Dinner',
        aestheticStyle: 'Minimalist Industrial',
        colorPalette: 'Midnight Navy & Starry Lights',
        primaryLighting: 'Edison Bulbs & Industrial Festoons',
        customNotes: 'Keep the center aisle clear for projector screen'
      };

      const result = validateSpecifications(valid);
      expect(result.celebrationType).toBe('Corporate Dinner');
      expect(result.aestheticStyle).toBe('Minimalist Industrial');
      expect(result.customNotes).toBe('Keep the center aisle clear for projector screen');
    });
  });

  describe('validateChecklistItem', () => {
    it('returns a safe fallback item when given null or non-object', () => {
      const item = validateChecklistItem(null, 3);
      expect(item.id).toContain('item-3-');
      expect(item.category).toBe('General Decor');
      expect(item.quantity).toBe(1);
      expect(item.unitCost).toBe(100);
      expect(item.completed).toBe(false);
    });

    it('bounds negative unit cost to 0 and clamps non-numeric quantity to 1', () => {
      const invalid = {
        id: 'bad-1',
        category: 'Lighting',
        name: 'Festoon Cable',
        quantity: -10,
        unitCost: -500,
        completed: false
      };

      const valid = validateChecklistItem(invalid);
      expect(valid.quantity).toBe(1);
      expect(valid.unitCost).toBe(0);
    });

    it('sanitizes HTML injection in item name and notes', () => {
      const injection = {
        id: 'item-x',
        category: 'Florals',
        name: '<img src=x onerror=alert("pwned")>White Roses',
        quantity: 20,
        unitCost: 15,
        completed: true,
        notes: 'javascript:alert(1)'
      };

      const valid = validateChecklistItem(injection);
      expect(valid.name).toBe('White Roses');
      expect(valid.notes).not.toContain('javascript:');
      expect(valid.completed).toBe(true);
    });
  });
});