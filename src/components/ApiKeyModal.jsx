import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck, FileCode } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey, isEnvKey = false }) {
  const [keyValue, setKeyValue] = useState(currentKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState('idle'); // 'idle' | 'testing' | 'success' | 'error'
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    setKeyValue(currentKey || '');
    setTestStatus('idle');
    setTestMessage('');
  }, [currentKey, isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const keyToTest = keyValue.trim() || currentKey;
    if (!keyToTest) {
      setTestStatus('error');
      setTestMessage('No API key found to test.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Connecting to Google GenAI SDK...');

    try {
      const ai = new GoogleGenAI({ apiKey: keyToTest });
      const resp = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping test for venue decorator.'
      });

      if (resp && resp.text) {
        setTestStatus('success');
        setTestMessage('API Key verified successfully with gemini-3.8-flash!');
      } else {
        throw new Error('Unexpected empty response.');
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err.message || 'Verification failed. Please double check the key.');
    }
  };

  const handleSave = () => {
    onSaveKey(keyValue.trim());
    onClose();
  };

  const handleClear = () => {
    setKeyValue('');
    onSaveKey('');
    setTestStatus('idle');
    setTestMessage('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-7 shadow-2xl border border-pink-500/30 bg-[#1A1A22]">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-ring"
          aria-label="Close API Key Settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-hotpink-500/20 border border-hotpink-500/40 flex items-center justify-center text-hotpink-400 shadow-pink-glow-sm">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 id="api-modal-title" className="text-xl font-bold text-white">
              Google GenAI Environment Settings
            </h2>
            <p className="text-xs text-slate-400">
              Pipeline: Gemini 2.5 Flash + In-Place Venue Redecoration
            </p>
          </div>
        </div>

        {/* Environment Variable Active Banner */}
        {isEnvKey ? (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Loaded from Environment Variable (.env)</span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Your API key is automatically loaded from <code className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-white font-mono">VITE_GEMINI_API_KEY</code> in your project's <code className="text-white font-mono">.env</code> file.
            </p>
          </div>
        ) : (
          <div className="mb-5 p-3.5 rounded-xl bg-charcoal-900/90 border border-white/10 text-xs text-slate-300 space-y-2">
            <div className="flex items-start space-x-2">
              <FileCode className="w-4 h-4 text-hotpink-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Recommended: Configure in .env file</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Set <code className="text-hotpink-300 font-mono">VITE_GEMINI_API_KEY=your_key</code> in your <code className="text-slate-200 font-mono">.env</code> file to keep your key permanently configured without manual typing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input Field / Env Value Preview */}
        <div className="mb-4">
          <label htmlFor="gemini-key-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            {isEnvKey ? 'Environment API Key' : 'Gemini API Key (or paste override)'}
          </label>
          <div className="relative">
            <input
              id="gemini-key-input"
              type={showKey ? 'text' : 'password'}
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder="AIzaSy... or configure in .env"
              className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-charcoal-900 border border-pink-500/20 text-white placeholder-slate-500 focus-ring font-mono text-sm"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Test Feedback Area */}
        {testStatus !== 'idle' && (
          <div
            aria-live="polite"
            className={`mb-4 p-3 rounded-lg text-xs flex items-center space-x-2 ${
              testStatus === 'testing'
                ? 'bg-blue-950/40 text-blue-300 border border-blue-500/30'
                : testStatus === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
            }`}
          >
            {testStatus === 'testing' && <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />}
            {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span className="truncate">{testMessage}</span>
          </div>
        )}

        {/* Google AI Studio Link */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-400">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-hotpink-400 hover:text-hotpink-300 underline underline-offset-4 focus-ring"
          >
            <span>Get a free Gemini API Key from Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleClear}
            disabled={!keyValue || isEnvKey}
            className="px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Clear Override
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={!keyValue.trim() || testStatus === 'testing'}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg border border-white/10 transition-colors focus-ring disabled:opacity-40"
            >
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-hotpink-600 to-hotpink-500 hover:from-hotpink-500 hover:to-hotpink-400 rounded-lg shadow-pink-glow-sm transition-all focus-ring"
            >
              {isEnvKey ? 'Close Settings' : 'Save Key'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
