import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { VenueUploader } from '../components/VenueUploader';

describe('VenueUploader Edge Cases & Validation', () => {
  it('displays an alert role and rejects files larger than 10MB', async () => {
    const handleSetCustomVenue = vi.fn();
    render(
      <VenueUploader
        selectedTemplate={null}
        customVenue={null}
        onSelectTemplate={vi.fn()}
        onSetCustomVenue={handleSetCustomVenue}
      />
    );

    const oversizedFile = new File(['content'], 'giant-barn.jpg', { type: 'image/jpeg' });
    Object.defineProperty(oversizedFile, 'size', { value: 12 * 1024 * 1024 }); // 12MB

    const fileInput = screen.getByLabelText(/upload custom venue photo drag and drop area/i).querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [oversizedFile] } });

    await waitFor(() => {
      const alertBox = screen.getByRole('alert');
      expect(alertBox).toBeInTheDocument();
      expect(alertBox).toHaveTextContent(/exceeds the 10MB limit/i);
    });

    expect(handleSetCustomVenue).not.toHaveBeenCalled();
  });

  it('rejects unsupported file mime types such as PDF or plain text', async () => {
    const handleSetCustomVenue = vi.fn();
    render(
      <VenueUploader
        selectedTemplate={null}
        customVenue={null}
        onSelectTemplate={vi.fn()}
        onSetCustomVenue={handleSetCustomVenue}
      />
    );

    const invalidFile = new File(['%PDF-1.4'], 'specs.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/upload custom venue photo drag and drop area/i).querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      const alertBox = screen.getByRole('alert');
      expect(alertBox).toBeInTheDocument();
      expect(alertBox).toHaveTextContent(/invalid file type/i);
    });

    expect(handleSetCustomVenue).not.toHaveBeenCalled();
  });

  it('ignores drop and click when disabled is true', () => {
    const handleSetCustomVenue = vi.fn();
    render(
      <VenueUploader
        selectedTemplate={null}
        customVenue={null}
        onSelectTemplate={vi.fn()}
        onSetCustomVenue={handleSetCustomVenue}
        disabled={true}
      />
    );

    const dropArea = screen.getByLabelText(/upload custom venue photo drag and drop area/i);
    expect(dropArea).toHaveClass('opacity-50');

    // Attempt drop
    const file = new File(['content'], 'venue.jpg', { type: 'image/jpeg' });
    fireEvent.drop(dropArea, {
      dataTransfer: { files: [file] }
    });

    expect(handleSetCustomVenue).not.toHaveBeenCalled();
  });
});