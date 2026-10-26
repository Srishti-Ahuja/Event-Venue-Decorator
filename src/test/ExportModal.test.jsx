import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ExportModal } from '../components/ExportModal';

describe('ExportModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ExportModal
        isOpen={false}
        onClose={vi.fn()}
        originalImage="orig.jpg"
        decoratedImage="dec.jpg"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders export options when isOpen is true', () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={vi.fn()}
        originalImage="orig.jpg"
        decoratedImage="dec.jpg"
        checklist={[]}
      />
    );

    expect(screen.getByText('Export & Share Project Hub')).toBeInTheDocument();
    expect(screen.getByText('Side-by-Side Comparison PNG')).toBeInTheDocument();
    expect(screen.getByText('AI Decorated Render Only (JPEG)')).toBeInTheDocument();
    expect(screen.getByText('Vendor Decor Checklist (CSV)')).toBeInTheDocument();
    expect(screen.getByText('Printable Decor Specification Sheet')).toBeInTheDocument();
  });

  it('triggers window.print when Printable Decor Sheet is clicked', () => {
    render(
      <ExportModal
        isOpen={true}
        onClose={vi.fn()}
        originalImage="orig.jpg"
        decoratedImage="dec.jpg"
      />
    );

    const printBtn = screen.getByText('Printable Decor Specification Sheet').closest('button');
    fireEvent.click(printBtn);

    expect(window.print).toHaveBeenCalledTimes(1);
  });
});
