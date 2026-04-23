import React from 'react';

/**
 * Full-screen or inline loading spinner with optional message.
 */
export default function LoadingSpinner({ message = 'Loading...', progress = null, total = null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 fade-in-up">
      {/* Spinner rings */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin-slow"
          style={{ borderTopColor: '#1DB954', borderRightColor: 'rgba(29,185,84,0.3)' }}
        />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: 'rgba(29,185,84,0.5)',
            animation: 'spin 2.2s linear infinite reverse',
          }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full" style={{ background: '#1DB954' }} />
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-white font-semibold text-lg">{message}</p>
        {progress !== null && total !== null && (
          <p className="text-sm mt-1" style={{ color: '#B3B3B3' }}>
            Searching track {progress} of {total}...
          </p>
        )}
      </div>

      {/* Progress bar */}
      {progress !== null && total !== null && (
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(progress / total) * 100}%`,
              background: 'linear-gradient(90deg, #1DB954, #1ed760)',
            }}
          />
        </div>
      )}
    </div>
  );
}
