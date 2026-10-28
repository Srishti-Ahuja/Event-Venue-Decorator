import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with default value if localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('reads existing value from localStorage', () => {
    window.localStorage.setItem('test_key', JSON.stringify('saved_value'));
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
    expect(result.current[0]).toBe('saved_value');
  });

  it('persists updated value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial'));
    act(() => {
      result.current[1]('updated_value');
    });
    expect(result.current[0]).toBe('updated_value');
    expect(JSON.parse(window.localStorage.getItem('test_key'))).toBe('updated_value');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 10));
    act(() => {
      result.current[1]((prev) => prev + 5);
    });
    expect(result.current[0]).toBe(15);
  });

  it('falls back to initialValue if localStorage contains corrupted JSON', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem('corrupted_key', 'INVALID_JSON{{{');
    const { result } = renderHook(() => useLocalStorage('corrupted_key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    warnSpy.mockRestore();
  });

  it('synchronizes value across tabs on window StorageEvent', () => {
    const { result } = renderHook(() => useLocalStorage('sync_key', 'tab1_initial'));
    expect(result.current[0]).toBe('tab1_initial');

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'sync_key',
        newValue: JSON.stringify('tab2_update')
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe('tab2_update');
  });

  it('resets to initialValue if storage key was cleared (newValue is null)', () => {
    const { result } = renderHook(() => useLocalStorage('sync_key', 'default_val'));
    act(() => {
      result.current[1]('custom_val');
    });
    expect(result.current[0]).toBe('custom_val');

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'sync_key',
        newValue: null
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe('default_val');
  });

  it('ignores storage events for other keys', () => {
    const { result } = renderHook(() => useLocalStorage('my_key', 'original'));
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'unrelated_key',
        newValue: JSON.stringify('other_value')
      });
      window.dispatchEvent(event);
    });
    expect(result.current[0]).toBe('original');
  });
});
