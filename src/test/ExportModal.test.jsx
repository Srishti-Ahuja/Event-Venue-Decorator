import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExportModal } from '../components/ExportModal';
import * as exportUtils from '../utils/exportUtils';

vi.mock('../utils/exportUtils', () => ({
  downloadImage: vi.fn(),
  createCompositeComparison: vi.fn().mockResolvedValue('data:image/png;base64,composite_data'),
  exportChecklistToCSV: vi.fn()
}));

describe('ExportModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    originalImage: 'data:image/jpeg;base64,orig',
    decoratedImage: 'data:image/jpeg;base64,decor',
    checklist: [
      { id: '1', category: 'Decor', name: 'Floral Arch', quantity: 1, unitCost: 500 }
    ],
    venueTitle: 'Grand Ballroom',
    specifications: { aestheticStyle: 'Royal Rajputana Luxury' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.print = vi.fn();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ExportModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal dialog with accessible roles and title when open', () => {
    render(<ExportModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('heading', { level: 2, name: /export & share project hub/i })).toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    render(<ExportModal {...defaultProps} />);
    const closeBtn = screen.getByRole('button', { name: /close export hub/i });
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when pressing the Escape key', () => {
    render(<ExportModal {...defaultProps} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when modal is closed', () => {
    const onClose = vi.fn();
    render(<ExportModal {...defaultProps} isOpen={false} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('triggers downloadImage for AI render when clicking AI Decorated Render Only', () => {
    render(<ExportModal {...defaultProps} />);
    const btn = screen.getByRole('button', { name: /ai decorated render only/i });
    fireEvent.click(btn);
    expect(exportUtils.downloadImage).toHaveBeenCalledWith(
      defaultProps.decoratedImage,
      expect.stringMatching(/^ai-decorated-render-\d+\.jpg$/)
    );
  });

  it('triggers exportChecklistToCSV when clicking Vendor Decor Checklist', () => {
    render(<ExportModal {...defaultProps} />);
    const btn = screen.getByRole('button', { name: /vendor decor checklist/i });
    fireEvent.click(btn);
    expect(exportUtils.exportChecklistToCSV).toHaveBeenCalledWith(defaultProps.checklist, 'USD');
  });

  it('creates and downloads composite comparison graphic when clicking Side-by-Side Comparison', async () => {
    render(<ExportModal {...defaultProps} />);
    const btn = screen.getByRole('button', { name: /side-by-side comparison png/i });
    await fireEvent.click(btn);
    expect(exportUtils.createCompositeComparison).toHaveBeenCalledWith(
      defaultProps.originalImage,
      defaultProps.decoratedImage,
      expect.objectContaining({
        title: 'Grand Ballroom',
        style: 'Royal Rajputana Luxury'
      })
    );
  });

  it('triggers window.print when clicking Printable Decor Specification Sheet', () => {
    render(<ExportModal {...defaultProps} />);
    const btn = screen.getByRole('button', { name: /printable decor specification sheet/i });
    fireEvent.click(btn);
    expect(window.print).toHaveBeenCalledTimes(1);
  });
});
