import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PromptRefiner } from '../components/PromptRefiner';

describe('PromptRefiner Component', () => {
  const sampleSpatial = {
    roomType: 'Vaulted Barn',
    ceilingHeight: '26 feet exposed beams',
    architecturalAnchors: ['Central timber posts', 'Sliding barn doors'],
    lightingAnalysis: 'Subdued natural daylight'
  };

  it('renders spatial analysis breakdown and quick modifier chips', () => {
    render(
      <PromptRefiner
        prompt="A romantic rustic barn with fairy lights"
        spatialAnalysis={sampleSpatial}
        onRegenerate={vi.fn()}
      />
    );

    expect(screen.getByText(/AI Spatial Analysis & Prompt Refiner/i)).toBeInTheDocument();
    expect(screen.getByText('Vaulted Barn')).toBeInTheDocument();
    expect(screen.getByText('Central timber posts')).toBeInTheDocument();
    expect(screen.getByText(/Add cascading hanging wisteria florals from ceiling/i)).toBeInTheDocument();
  });

  it('appends quick modifier chip text to prompt when clicked', () => {
    render(
      <PromptRefiner
        prompt="A romantic rustic barn"
        spatialAnalysis={sampleSpatial}
        onRegenerate={vi.fn()}
      />
    );

    const chip = screen.getByText(/Switch to flickering candlelight & brass lanterns/i);
    fireEvent.click(chip);

    const textarea = screen.getByLabelText(/Master Generative Synthesis Prompt/i);
    expect(textarea.value).toContain('Switch to flickering candlelight & brass lanterns');
  });

  it('calls onRegenerate with edited prompt when Refine & Re-render is clicked', () => {
    const handleRegenerate = vi.fn();
    render(
      <PromptRefiner
        prompt="Initial prompt"
        spatialAnalysis={sampleSpatial}
        onRegenerate={handleRegenerate}
      />
    );

    const textarea = screen.getByLabelText(/Master Generative Synthesis Prompt/i);
    fireEvent.change(textarea, { target: { value: 'Updated prompt with rose petals' } });

    const reRenderBtn = screen.getByRole('button', { name: /refine & re-render/i });
    fireEvent.click(reRenderBtn);

    expect(handleRegenerate).toHaveBeenCalledWith('Updated prompt with rose petals');
  });

  it('copies prompt text when Copy button is clicked', () => {
    render(
      <PromptRefiner
        prompt="Prompt to copy"
        spatialAnalysis={sampleSpatial}
        onRegenerate={vi.fn()}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Prompt to copy');
  });

  it('avoids double periods when appending modifier chips to a prompt with existing period', () => {
    render(
      <PromptRefiner
        prompt="A romantic rustic barn."
        spatialAnalysis={sampleSpatial}
        onRegenerate={vi.fn()}
      />
    );

    const chip = screen.getByText(/Switch to flickering candlelight & brass lanterns/i);
    fireEvent.click(chip);

    const textarea = screen.getByLabelText(/Master Generative Synthesis Prompt/i);
    expect(textarea.value).not.toContain('..');
    expect(textarea.value).toMatch(/\.$/);
  });
});
