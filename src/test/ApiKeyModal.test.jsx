import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ApiKeyModal } from '../components/ApiKeyModal';

describe('ApiKeyModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ApiKeyModal
        isOpen={false}
        onClose={vi.fn()}
        currentKey=""
        onSaveKey={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal with title and environment information when isOpen is true', () => {
    render(
      <ApiKeyModal
        isOpen={true}
        onClose={vi.fn()}
        currentKey="test-key-abc"
        onSaveKey={vi.fn()}
        isEnvKey={true}
      />
    );

    expect(screen.getByText('Google GenAI Environment Settings')).toBeInTheDocument();
    expect(screen.getByText(/Loaded from Environment Variable \(\.env\)/i)).toBeInTheDocument();
  });

  it('toggles password visibility when eye button is clicked', () => {
    render(
      <ApiKeyModal
        isOpen={true}
        onClose={vi.fn()}
        currentKey="my-secret-key"
        onSaveKey={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/gemini api key/i);
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText(/show key/i);
    fireEvent.click(toggleBtn);

    expect(input).toHaveAttribute('type', 'text');
  });

  it('calls onSaveKey and onClose when Save Key is clicked', () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <ApiKeyModal
        isOpen={true}
        onClose={handleClose}
        currentKey=""
        onSaveKey={handleSave}
        isEnvKey={false}
      />
    );

    const input = screen.getByLabelText(/gemini api key/i);
    fireEvent.change(input, { target: { value: 'AIzaSyNewKey123' } });

    const saveBtn = screen.getByRole('button', { name: /save key/i });
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledWith('AIzaSyNewKey123');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key press', () => {
    const handleClose = vi.fn();

    render(
      <ApiKeyModal
        isOpen={true}
        onClose={handleClose}
        currentKey=""
        onSaveKey={vi.fn()}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
