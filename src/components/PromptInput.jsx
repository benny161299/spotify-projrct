import React, { useState, useRef } from 'react';

const EXAMPLE_PROMPTS = [
  'Sad indie music for a rainy afternoon',
  'High-energy workout bangers for the gym',
  'Chill lo-fi beats to study and focus',
  'Feel-good 90s hits for a road trip',
  'Late night jazz to unwind with a drink',
];

/**
 * Prompt input area with textarea, example chips, and submit button.
 */
export default function PromptInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSubmit(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const useExample = (example) => {
    setValue(example);
    textareaRef.current?.focus();
  };

  const canSubmit = value.trim().length > 0 && !disabled;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="playlist-prompt"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Describe your perfect playlist… (e.g. sad indie music for a rainy afternoon)"
          rows={4}
          className="w-full rounded-xl px-5 py-4 text-base resize-none outline-none transition-all duration-200 placeholder:text-sm"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.12)',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
          }}
          onFocus={(e) => {
            e.target.style.border = '1.5px solid #1DB954';
            e.target.style.boxShadow = '0 0 0 3px rgba(29,185,84,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.border = '1.5px solid rgba(255,255,255,0.12)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {/* Character hint */}
        {value.length > 0 && (
          <span
            className="absolute bottom-3 right-4 text-xs"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            ↵ Enter to generate
          </span>
        )}
      </div>

      {/* Example prompt chips */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => useExample(ex)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#B3B3B3',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29,185,84,0.15)';
              e.currentTarget.style.borderColor = 'rgba(29,185,84,0.4)';
              e.currentTarget.style.color = '#1DB954';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = '#B3B3B3';
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        id="generate-playlist-btn"
        disabled={!canSubmit}
        className="btn-spotify px-8 py-4 text-base self-start"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
        Generate Playlist
      </button>
    </form>
  );
}
