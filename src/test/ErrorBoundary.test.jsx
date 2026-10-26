import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

function ProblemChild() {
  throw new Error('Test crash in child component');
}

function GoodChild() {
  return <div>Application is running smoothly</div>;
}

describe('ErrorBoundary Component', () => {
  it('renders children when no errors occur', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Application is running smoothly')).toBeInTheDocument();
  });

  it('catches error and renders friendly fallback UI', () => {
    // Suppress console.error during test error catch
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Test crash in child component/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload application/i })).toBeInTheDocument();

    spy.mockRestore();
  });
});
