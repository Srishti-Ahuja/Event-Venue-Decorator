import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { VenueUploader } from '../components/VenueUploader';
import { VENUE_TEMPLATES } from '../services/templates';

describe('VenueUploader Component', () => {
  it('renders all 3 pre-populated venue templates', () => {
    render(
      <VenueUploader
        selectedTemplate={VENUE_TEMPLATES[0]}
        customVenue={null}
        onSelectTemplate={vi.fn()}
        onSetCustomVenue={vi.fn()}
      />
    );

    expect(screen.getByText('Rustic Barn')).toBeInTheDocument();
    expect(screen.getByText('Grand Ballroom')).toBeInTheDocument();
    expect(screen.getByText('Open Lawn')).toBeInTheDocument();
  });

  it('calls onSelectTemplate when a template card is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <VenueUploader
        selectedTemplate={VENUE_TEMPLATES[0]}
        customVenue={null}
        onSelectTemplate={handleSelect}
        onSetCustomVenue={vi.fn()}
      />
    );

    const ballroomBtn = screen.getByRole('button', { name: /grand ballroom/i });
    fireEvent.click(ballroomBtn);

    expect(handleSelect).toHaveBeenCalledWith('grand-ballroom');
  });

  it('renders custom venue preview when customVenue is provided', () => {
    const mockCustom = {
      dataUrl: 'data:image/jpeg;base64,123',
      originalName: 'MyGarden.jpg',
      width: 1920,
      height: 1080,
      sizeKb: 650
    };

    render(
      <VenueUploader
        selectedTemplate={null}
        customVenue={mockCustom}
        onSelectTemplate={vi.fn()}
        onSetCustomVenue={vi.fn()}
      />
    );

    expect(screen.getByText('MyGarden.jpg')).toBeInTheDocument();
    expect(screen.getByText(/1920 x 1080px/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /replace photo/i })).toBeInTheDocument();
  });

  it('disables controls when disabled prop is true', () => {
    render(
      <VenueUploader
        selectedTemplate={VENUE_TEMPLATES[0]}
        customVenue={null}
        onSelectTemplate={vi.fn()}
        onSetCustomVenue={vi.fn()}
        disabled={true}
      />
    );

    const barnBtn = screen.getByRole('button', { name: /rustic barn/i });
    expect(barnBtn).toBeDisabled();
  });
});
