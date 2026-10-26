import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Navbar } from '../components/Navbar';

describe('Navbar Component', () => {
  it('renders application branding title and subtitle', () => {
    render(<Navbar apiKey="" onResetToDefault={vi.fn()} />);

    expect(screen.getByText('Venue Decorator')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(
      screen.getByText(/Two-Stage Spatial Layout Analysis & Generative Visualization/i)
    ).toBeInTheDocument();
  });

  it('shows Demo Simulation Mode badge when no apiKey is passed', () => {
    render(<Navbar apiKey="" onResetToDefault={vi.fn()} />);

    expect(screen.getByText('Demo Simulation Mode')).toBeInTheDocument();
  });

  it('shows GenAI Live Pipeline badge when apiKey is present', () => {
    render(<Navbar apiKey="ai-key-123" onResetToDefault={vi.fn()} />);

    expect(screen.getByText('GenAI Live Pipeline')).toBeInTheDocument();
  });

  it('triggers onResetToDefault when Reset button is clicked', () => {
    const handleReset = vi.fn();
    render(<Navbar apiKey="" onResetToDefault={handleReset} />);

    const resetBtn = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
