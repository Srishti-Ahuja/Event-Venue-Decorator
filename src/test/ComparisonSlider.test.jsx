import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ComparisonSlider } from '../components/ComparisonSlider';

describe('ComparisonSlider Component', () => {
  it('renders placeholder when decoratedImage is null', () => {
    render(
      <ComparisonSlider
        originalImage="https://example.com/bare.jpg"
        decoratedImage={null}
        title="Empty Hall"
      />
    );

    expect(
      screen.getByText(/Original Bare Space \(Ready for AI Transformation\)/i)
    ).toBeInTheDocument();
  });

  it('renders interactive split slider when both images are provided', () => {
    render(
      <ComparisonSlider
        originalImage="https://example.com/bare.jpg"
        decoratedImage="https://example.com/decorated.jpg"
        title="Historic Barn"
        onDownloadComposite={vi.fn()}
      />
    );

    expect(screen.getByText(/Before & After Transformation/i)).toBeInTheDocument();
    expect(screen.getByText(/Bare Venue Space/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Decorated Render/i)).toBeInTheDocument();
  });

  it('handles keyboard navigation with ArrowLeft and ArrowRight keys', () => {
    render(
      <ComparisonSlider
        originalImage="https://example.com/bare.jpg"
        decoratedImage="https://example.com/decorated.jpg"
        title="Historic Barn"
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '50');

    // Arrow Left moves slider left
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider).toHaveAttribute('aria-valuenow', '45');

    // Arrow Right moves slider right
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '50');

    // Home key to 0
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider).toHaveAttribute('aria-valuenow', '0');

    // End key to 100
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '100');
  });

  it('switches to Side by Side view mode', () => {
    render(
      <ComparisonSlider
        originalImage="https://example.com/bare.jpg"
        decoratedImage="https://example.com/decorated.jpg"
        title="Historic Barn"
      />
    );

    const sideBySideBtn = screen.getByRole('button', { name: /side by side/i });
    fireEvent.click(sideBySideBtn);

    expect(screen.getByText('Bare Space')).toBeInTheDocument();
    expect(screen.getByText('AI Decorated')).toBeInTheDocument();
  });

  it('switches to Toggle view mode and flips images on click', () => {
    render(
      <ComparisonSlider
        originalImage="https://example.com/bare.jpg"
        decoratedImage="https://example.com/decorated.jpg"
        title="Historic Barn"
      />
    );

    const toggleModeBtn = screen.getByRole('button', { name: /toggle view/i });
    fireEvent.click(toggleModeBtn);

    expect(screen.getByText(/Showing: AI Decorated Render/i)).toBeInTheDocument();

    const toggleContainer = screen.getByText(/Showing: AI Decorated Render/i).closest('div').parentElement;
    fireEvent.click(toggleContainer);

    expect(screen.getByText(/Showing: Bare Venue Space/i)).toBeInTheDocument();
  });

  it('triggers onDownloadComposite when download button is clicked', () => {
    const handleDownload = vi.fn();
    render(
      <ComparisonSlider
        originalImage="https://example.com/bare.jpg"
        decoratedImage="https://example.com/decorated.jpg"
        title="Historic Barn"
        onDownloadComposite={handleDownload}
      />
    );

    const downloadBtn = screen.getByRole('button', { name: /download composite image/i });
    fireEvent.click(downloadBtn);

    expect(handleDownload).toHaveBeenCalledTimes(1);
  });
});
