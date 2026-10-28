import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('App Full Integration Test', () => {
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

  it('mounts full application with all landmarks, controls, and visualizer', () => {
    render(<App />);

    // Header Landmark
    expect(screen.getByText('Venue Decorator')).toBeInTheDocument();

    // Hero Section
    expect(
      screen.getByRole('heading', { name: /Transform Any Bare Venue Into A Breathtaking Masterpiece/i })
    ).toBeInTheDocument();

    // Step 1: Venue Presets
    expect(screen.getByText('Rustic Barn')).toBeInTheDocument();
    expect(screen.getByText('Grand Ballroom')).toBeInTheDocument();
    expect(screen.getByText('Open Lawn')).toBeInTheDocument();

    // Step 2: Specification Form
    expect(screen.getByLabelText(/celebration type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aesthetic style/i)).toBeInTheDocument();

    // Comparison Slider
    expect(screen.getByText(/Before & After Transformation/i)).toBeInTheDocument();

    // Prompt Refiner
    expect(screen.getByText(/AI Spatial Analysis & Prompt Refiner/i)).toBeInTheDocument();

    // Decor Checklist
    expect(screen.getByText(/Itemized Vendor Decor Checklist/i)).toBeInTheDocument();
  });

  it('selects a different preset template and updates specifications', () => {
    render(<App />);

    const openLawnBtn = screen.getByRole('button', { name: /open lawn/i });
    fireEvent.click(openLawnBtn);

    // Verify Open Lawn specs loaded
    expect(screen.getByText('Pure White & Eucalyptus Green')).toBeInTheDocument();
  });

  it('selects a color palette swatch theme', () => {
    render(<App />);

    const emeraldSwatch = screen.getByRole('radio', { name: /emerald/i });
    fireEvent.click(emeraldSwatch);

    expect(screen.getByText('Emerald & Warm Gold')).toBeInTheDocument();
  });

  it('executes full venue redecoration pipeline on button click', async () => {
    render(<App />);

    const generateBtn = screen.getByRole('button', { name: /transform & redecorate this venue/i });
    fireEvent.click(generateBtn);

    // Pipeline status appears
    expect(screen.getByText(/Multimodal Two-Stage Generation Pipeline/i)).toBeInTheDocument();

    // Await completion
    await waitFor(
      () => {
        expect(screen.getAllByText(/Transformation visualization complete!/i).length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 10000 }
    );
  }, 15000);
});
