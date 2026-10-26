import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns initialValue when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial_val'));
    expect(result.current[0]).toBe('initial_val');
  });

  it('updates state and persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'initial_val'));

    act(() => {
      result.current[1]('updated_val');
    });

    expect(result.current[0]).toBe('updated_val');
    expect(JSON.parse(window.localStorage.getItem('test_key'))).toBe('updated_val');
  });

  it('stores and retrieves complex objects', () => {
    const initialObj = { theme: 'dark', count: 1 };
    const { result } = renderHook(() => useLocalStorage('obj_key', initialObj));

    const newObj = { theme: 'pink', count: 5 };
    act(() => {
      result.current[1](newObj);
    });

    expect(result.current[0]).toEqual(newObj);
    expect(JSON.parse(window.localStorage.getItem('obj_key'))).toEqual(newObj);
  });
});
