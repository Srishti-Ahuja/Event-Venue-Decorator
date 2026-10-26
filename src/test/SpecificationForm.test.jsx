import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SpecificationForm } from '../components/SpecificationForm';

describe('SpecificationForm Component', () => {
  const defaultSpecs = {
    celebrationType: 'Wedding Ceremony & Reception',
    aestheticStyle: 'Bohemian Romantic',
    colorPalette: 'Rose Gold & Champagne',
    primaryLighting: 'Fairy Lights & Twinkle Canopy',
    customNotes: 'Floral arch at central timber beam'
  };

  it('renders all specification dropdowns and controls', () => {
    render(
      <SpecificationForm
        specifications={defaultSpecs}
        onChange={vi.fn()}
        onGenerate={vi.fn()}
        renderMode="inPlace"
        onRenderModeChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/celebration type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aesthetic style/i)).toBeInTheDocument();
    expect(screen.getByText(/color palette theme/i)).toBeInTheDocument();
    expect(screen.getByText(/primary lighting atmosphere/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/custom decor notes/i)).toBeInTheDocument();
  });

  it('calls onChange when celebration type is changed', () => {
    const handleChange = vi.fn();
    render(
      <SpecificationForm
        specifications={defaultSpecs}
        onChange={handleChange}
        onGenerate={vi.fn()}
        renderMode="inPlace"
        onRenderModeChange={vi.fn()}
      />
    );

    const select = screen.getByLabelText(/celebration type/i);
    fireEvent.change(select, { target: { value: 'Luxury Gala & Charity Ball' } });

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultSpecs,
      celebrationType: 'Luxury Gala & Charity Ball'
    });
  });

  it('appends quick ideas to custom notes when tag clicked', () => {
    const handleChange = vi.fn();
    render(
      <SpecificationForm
        specifications={defaultSpecs}
        onChange={handleChange}
        onGenerate={vi.fn()}
        renderMode="inPlace"
        onRenderModeChange={vi.fn()}
      />
    );

    const tagBtn = screen.getByRole('button', { name: /\+ champagne tower table/i });
    fireEvent.click(tagBtn);

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultSpecs,
      customNotes: 'Floral arch at central timber beam Champagne tower table'
    });
  });

  it('triggers onRenderModeChange when switching redecoration mode', () => {
    const handleModeChange = vi.fn();
    render(
      <SpecificationForm
        specifications={defaultSpecs}
        onChange={vi.fn()}
        onGenerate={vi.fn()}
        renderMode="inPlace"
        onRenderModeChange={handleModeChange}
      />
    );

    const conceptBtn = screen.getByRole('button', { name: /conceptual ai synthesis/i });
    fireEvent.click(conceptBtn);

    expect(handleModeChange).toHaveBeenCalledWith('imagen3');
  });

  it('calls onGenerate when main action button is clicked', () => {
    const handleGenerate = vi.fn();
    render(
      <SpecificationForm
        specifications={defaultSpecs}
        onChange={vi.fn()}
        onGenerate={handleGenerate}
        renderMode="inPlace"
        onRenderModeChange={vi.fn()}
      />
    );

    const generateBtn = screen.getByRole('button', { name: /transform & redecorate this venue/i });
    fireEvent.click(generateBtn);

    expect(handleGenerate).toHaveBeenCalledTimes(1);
  });

  it('shows loading state and disables inputs when isLoading is true', () => {
    render(
      <SpecificationForm
        specifications={defaultSpecs}
        onChange={vi.fn()}
        onGenerate={vi.fn()}
        isLoading={true}
        statusMessage="Analyzing venue layout..."
        renderMode="inPlace"
        onRenderModeChange={vi.fn()}
      />
    );

    expect(screen.getByText(/analyzing venue layout/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/celebration type/i)).toBeDisabled();
  });
});
