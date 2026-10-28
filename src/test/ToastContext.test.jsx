import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ToastProvider, useToast } from '../context/ToastContext';

// Helper component that consumes useToast for testing
function TestToastConsumer() {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success('Success message')}>Trigger Success</button>
      <button onClick={() => toast.error('Error message')}>Trigger Error</button>
      <button onClick={() => toast.info('Info message')}>Trigger Info</button>
    </div>
  );
}

describe('ToastContext & Accessible Notification System', () => {
  it('renders children and maintains an accessible aria-live status container', () => {
    const { container } = render(
      <ToastProvider>
        <div>Content Inside Provider</div>
      </ToastProvider>
    );

    expect(screen.getByText('Content Inside Provider')).toBeInTheDocument();
    const liveRegion = container.querySelector('[role="status"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('displays success, error, and info toasts when triggered', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Trigger Error'));
    expect(screen.getByText('Error message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Trigger Info'));
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('allows manual dismissal of toasts via dismiss button', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    const dismissBtn = screen.getByLabelText(/dismiss notification/i);
    fireEvent.click(dismissBtn);

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('provides safe no-op methods when used outside ToastProvider', () => {
    let capturedToast;
    function StandaloneComponent() {
      capturedToast = useToast();
      return <div>Standalone</div>;
    }

    render(<StandaloneComponent />);
    expect(capturedToast).toBeDefined();
    // Calling methods outside provider should not throw
    expect(() => capturedToast.success('Test')).not.toThrow();
    expect(() => capturedToast.error('Test')).not.toThrow();
  });
});