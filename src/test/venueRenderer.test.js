import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redecorateVenueImage } from '../services/venueRenderer';

describe('In-Place Venue Redecoration Engine', () => {
  beforeEach(() => {
    // Setup Mock Image
    const originalImage = window.Image;
    class MockImage {
      constructor() {
        this.naturalWidth = 1600;
        this.naturalHeight = 900;
        this.width = 1600;
        this.height = 900;
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
      set src(_) {}
    }
    window.Image = MockImage;
  });

  it('synthesizes decor onto uploaded image and returns a valid dataUrl', async () => {
    const specifications = {
      celebrationType: 'Wedding',
      aestheticStyle: 'Bohemian Romantic',
      colorPalette: 'Rose Gold & Champagne',
      primaryLighting: 'Fairy Lights & Twinkle Canopy',
      customNotes: 'Floral arch at center'
    };

    const result = await redecorateVenueImage({
      imageSrc: 'data:image/jpeg;base64,mockBase64',
      specifications
    });

    expect(typeof result).toBe('string');
    expect(result).toMatch(/^data:image\/jpeg/);
  });

  it('renders correctly with Crystal Chandeliers lighting option', async () => {
    const specifications = {
      celebrationType: 'Luxury Gala',
      aestheticStyle: 'Luxury Glamour',
      colorPalette: 'Emerald & Warm Gold',
      primaryLighting: 'Crystal Chandeliers & Sconces',
      customNotes: 'Champagne tower table'
    };

    const result = await redecorateVenueImage({
      imageSrc: 'data:image/jpeg;base64,mockBase64',
      specifications,
      promptModifiers: 'Add crystal chandeliers and champagne tower'
    });

    expect(result).toMatch(/^data:image\/jpeg/);
  });

  it('renders correctly with Neon accents and Hot Pink palette', async () => {
    const specifications = {
      celebrationType: 'Milestone Birthday',
      aestheticStyle: 'Neon Glam / Cyberpunk',
      colorPalette: 'Hot Pink & Charcoal Noir',
      primaryLighting: 'Hot Pink Neon & Dynamic Uplighting',
      customNotes: 'Neon script on greenery wall'
    };

    const result = await redecorateVenueImage({
      imageSrc: 'data:image/jpeg;base64,mockBase64',
      specifications
    });

    expect(result).toMatch(/^data:image\/jpeg/);
  });

  it('renders correctly with Edison Bulbs and Sunset Coral palette', async () => {
    const specifications = {
      celebrationType: 'Cocktail Party',
      aestheticStyle: 'Modern Minimalist',
      colorPalette: 'Sunset Coral & Terracotta',
      primaryLighting: 'Edison Bulbs & Industrial Festoons',
      customNotes: 'Minimalist clean lines'
    };

    const result = await redecorateVenueImage({
      imageSrc: 'data:image/jpeg;base64,mockBase64',
      specifications
    });

    expect(result).toMatch(/^data:image\/jpeg/);
  });

  it('throws an error if imageSrc is missing or empty', async () => {
    await expect(redecorateVenueImage({
      imageSrc: null,
      specifications: {}
    })).rejects.toThrow('Image source is required');

    await expect(redecorateVenueImage({
      imageSrc: '',
      specifications: {}
    })).rejects.toThrow('Image source is required');
  });

  it('handles null or empty specifications object gracefully with default styling', async () => {
    const result = await redecorateVenueImage({
      imageSrc: 'data:image/jpeg;base64,mockBase64',
      specifications: null
    });

    expect(typeof result).toBe('string');
    expect(result).toMatch(/^data:image\/jpeg/);
  });
});
