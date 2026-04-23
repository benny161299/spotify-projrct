import React from 'react';

/**
 * Displays the list of tracks suggested by Gemini.
 * Shows a numbered list with title and artist.
 */
export default function TrackList({ tracks }) {
  if (!tracks || tracks.length === 0) return null;

  return (
    <div className="w-full fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#B3B3B3' }}>
          AI Suggested Tracks
        </h3>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: 'rgba(29,185,84,0.15)', color: '#1DB954' }}
        >
          {tracks.length} songs
        </span>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {tracks.map((track, index) => (
          <div
            key={`${track.title}-${track.artist}-${index}`}
            className="track-item flex items-center gap-4 px-4 py-3"
            style={{
              borderBottom: index < tracks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
          >
            {/* Track number */}
            <span
              className="text-sm w-6 text-right flex-shrink-0 tabular-nums"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              {index + 1}
            </span>

            {/* Music note icon */}
            <div
              className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(29,185,84,0.12)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>

            {/* Title and artist */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{track.title}</p>
              <p className="text-xs truncate" style={{ color: '#B3B3B3' }}>{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
