import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PipelineStatus } from '../components/PipelineStatus';

describe('PipelineStatus Component', () => {
  it('returns null when pipelineState status is idle', () => {
    const { container } = render(
      <PipelineStatus
        pipelineState={{
          status: 'idle',
          currentStage: null,
          progressPercent: 0,
          statusMessage: '',
          error: null
        }}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders stage progress and active messages during stage1', () => {
    render(
      <PipelineStatus
        pipelineState={{
          status: 'stage1',
          currentStage: 1,
          progressPercent: 35,
          statusMessage: 'Scanning room architecture...',
          error: null,
          stage1Duration: 0,
          stage2Duration: 0
        }}
      />
    );

    expect(screen.getByText(/Multimodal Two-Stage Generation Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText('35%')).toBeInTheDocument();
    expect(screen.getByText('Scanning room architecture...')).toBeInTheDocument();
    expect(screen.getByText(/Stage 1: Spatial Layout Analysis/i)).toBeInTheDocument();
  });

  it('renders duration counters and completion status when finished', () => {
    render(
      <PipelineStatus
        pipelineState={{
          status: 'completed',
          currentStage: null,
          progressPercent: 100,
          statusMessage: 'Transformation complete!',
          error: null,
          stage1Duration: 1.4,
          stage2Duration: 2.1
        }}
      />
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('1.4s')).toBeInTheDocument();
    expect(screen.getByText('2.1s')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('renders error notice and fatal errors when present', () => {
    render(
      <PipelineStatus
        pipelineState={{
          status: 'error',
          currentStage: null,
          progressPercent: 0,
          statusMessage: 'Failed',
          error: 'Network connection lost',
          errorNotice: 'Quota exceeded warning'
        }}
      />
    );

    expect(screen.getByText('Network connection lost')).toBeInTheDocument();
    expect(screen.getByText('Quota exceeded warning')).toBeInTheDocument();
  });
});
