import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BackgroundBokeh } from '../components/BackgroundBokeh';
import { PipelineStatus } from '../components/PipelineStatus';
import { ComparisonSlider } from '../components/ComparisonSlider';
import { DecorChecklist } from '../components/DecorChecklist';
import { SpecificationForm } from '../components/SpecificationForm';
import App from '../App';

describe('Accessibility (a11y) & Semantic Architecture Guardrails', () => {
  it('marks decorative BackgroundBokeh as aria-hidden to screen readers', () => {
    const { container } = render(<BackgroundBokeh />);
    const root = container.firstChild;
    expect(root).toHaveAttribute('aria-hidden', 'true');
  });

  it('provides an aria-live polite region in PipelineStatus during active pipeline stages', () => {
    const mockState = {
      status: 'stage1',
      currentStage: 1,
      progressPercent: 45,
      statusMessage: 'Scanning architectural anchors...',
      error: null
    };

    const { container } = render(<PipelineStatus pipelineState={mockState} />);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-label', 'Pipeline status region');
    expect(screen.getByText(/Scanning architectural anchors/i)).toBeInTheDocument();
  });

  it('exposes a slider role with full ARIA value bounds in ComparisonSlider', () => {
    render(
      <ComparisonSlider
        originalImage="https://example.com/bare.jpg"
        decoratedImage="https://example.com/dec.jpg"
        title="Test Space"
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(slider).toHaveAttribute('aria-label', 'Venue transformation split comparison slider');
  });

  it('includes an aria-live region on the DecorChecklist budget summary', () => {
    const { container } = render(
      <DecorChecklist
        checklist={[
          { id: '1', name: 'Chandelier', quantity: 1, unitCost: 300, completed: false }
        ]}
      />
    );

    const budgetCard = container.querySelector('[aria-live="polite"]');
    expect(budgetCard).toBeInTheDocument();
    expect(budgetCard).toHaveAttribute('aria-atomic', 'true');
  });

  it('provides semantic radiogroup roles for palette and lighting in SpecificationForm', () => {
    const mockSpecs = {
      celebrationType: 'Luxury Gala & Charity Ball',
      aestheticStyle: 'Luxury Glamour',
      colorPalette: 'Emerald & Warm Gold',
      primaryLighting: 'Crystal Chandeliers & Sconces',
      budgetTier: 'Luxury',
      guestCount: '200-300',
      customNotes: ''
    };

    render(
      <SpecificationForm
        specifications={mockSpecs}
        onChange={() => {}}
        onGenerate={() => {}}
      />
    );

    const paletteGroup = screen.getByRole('radiogroup', { name: /color palette theme/i });
    expect(paletteGroup).toBeInTheDocument();
    const selectedPalette = screen.getByRole('radio', { name: /emerald/i });
    expect(selectedPalette).toHaveAttribute('aria-checked', 'true');

    const lightingGroup = screen.getByRole('radiogroup', { name: /primary lighting atmosphere/i });
    expect(lightingGroup).toBeInTheDocument();
    const selectedLighting = screen.getByRole('radio', { name: /crystal chandeliers/i });
    expect(selectedLighting).toHaveAttribute('aria-checked', 'true');
  });

  it('renders a visually-hidden screen reader status announcer in App root', () => {
    const { container } = render(<App />);
    const srAnnouncer = container.querySelector('.sr-only[role="status"]');
    expect(srAnnouncer).toBeInTheDocument();
    expect(srAnnouncer).toHaveAttribute('aria-live', 'polite');
    expect(srAnnouncer).toHaveAttribute('aria-atomic', 'true');
  });
});