import { describe, it, expect } from 'vitest';
import {
  VENUE_TEMPLATES,
  CELEBRATION_TYPES,
  AESTHETIC_STYLES,
  COLOR_PALETTES,
  LIGHTING_OPTIONS,
  QUICK_MODIFIERS
} from '../services/templates';

describe('Templates & Presets Data Integrity', () => {
  it('contains the 3 required pre-populated venue templates', () => {
    expect(VENUE_TEMPLATES.length).toBe(3);
    const ids = VENUE_TEMPLATES.map((t) => t.id);
    expect(ids).toContain('rustic-barn');
    expect(ids).toContain('grand-ballroom');
    expect(ids).toContain('open-lawn');
  });

  it('validates each template has all required visual and architectural fields', () => {
    VENUE_TEMPLATES.forEach((template) => {
      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.tagline).toBeDefined();
      expect(template.dimensions).toBeDefined();
      expect(template.bareImage).toMatch(/^https?:\/\//);
      expect(template.decoratedImage).toMatch(/^https?:\/\//);
      expect(template.defaultSpecs).toBeDefined();
      expect(template.defaultSpecs.celebrationType).toBeDefined();
      expect(template.defaultSpecs.aestheticStyle).toBeDefined();
      expect(template.defaultSpecs.colorPalette).toBeDefined();
      expect(template.defaultSpecs.primaryLighting).toBeDefined();
      expect(template.spatialAnalysis).toBeDefined();
      expect(Array.isArray(template.checklist)).toBe(true);
      expect(template.checklist.length).toBeGreaterThan(0);
    });
  });

  it('validates checklist items have proper id, category, name, and positive unitCost', () => {
    VENUE_TEMPLATES.forEach((template) => {
      template.checklist.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.category).toBeDefined();
        expect(item.name).toBeDefined();
        expect(typeof item.quantity).toBe('number');
        expect(item.quantity).toBeGreaterThan(0);
        expect(typeof item.unitCost).toBe('number');
        expect(item.unitCost).toBeGreaterThan(0);
        expect(typeof item.completed).toBe('boolean');
      });
    });
  });

  it('contains valid celebration types, aesthetic styles, and swatches', () => {
    expect(CELEBRATION_TYPES.length).toBeGreaterThan(4);
    expect(AESTHETIC_STYLES.length).toBeGreaterThan(5);
    expect(COLOR_PALETTES.length).toBeGreaterThan(5);

    COLOR_PALETTES.forEach((palette) => {
      expect(palette.name).toBeDefined();
      expect(Array.isArray(palette.swatches)).toBe(true);
      expect(palette.swatches.length).toBeGreaterThan(2);
      palette.swatches.forEach((hex) => {
        expect(hex).toMatch(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
      });
    });
  });

  it('contains valid lighting options and quick modifiers', () => {
    expect(LIGHTING_OPTIONS.length).toBeGreaterThan(4);
    LIGHTING_OPTIONS.forEach((opt) => {
      expect(opt.id).toBeDefined();
      expect(opt.label).toBeDefined();
      expect(opt.icon).toBeDefined();
    });

    expect(QUICK_MODIFIERS.length).toBeGreaterThan(5);
    QUICK_MODIFIERS.forEach((mod) => {
      expect(mod.text).toBeDefined();
      expect(mod.tag).toBeDefined();
    });
  });
});
