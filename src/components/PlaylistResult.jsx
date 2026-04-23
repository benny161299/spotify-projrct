import React from 'react';

/**
 * Success state — shows the created playlist link and track count.
 */
export default function PlaylistResult({ playlistUrl, playlistName, trackCount, onCreateAnother }) {
  return (
    <div className="w-full flex flex-col items-center gap-6 fade-in-up py-4">
      {/* Success icon */}
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(29,185,84,0.25) 0%, rgba(29,185,84,0.05) 100%)',
            border: '2px solid rgba(29,185,84,0.4)',
            animation: 'pulse-green 2.5s ease-in-out infinite',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">
          {playlistUrl ? 'Playlist Created! 🎉' : 'AI Tracklist Ready! ✨'}
        </h2>
        <p className="text-sm" style={{ color: '#B3B3B3' }}>
          {playlistUrl ? (
            <>
              <span className="font-medium text-white">"{playlistName}"</span> is ready in your Spotify library
            </>
          ) : (
            <>
              Found <span className="font-medium" style={{ color: '#1DB954' }}>{trackCount} tracks</span> for your vibe.
            </>
          )}
        </p>
      </div>

      {/* Open in Spotify button - only if created successfully */}
      {playlistUrl ? (
        <a
          id="open-spotify-playlist-link"
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-spotify px-8 py-4 text-base no-underline"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Open in Spotify
        </a>
      ) : (
        <div className="text-center px-6 py-3 rounded-lg border border-dashed border-white/20 text-xs text-white/50">
          Spotify automatic creation requires a Premium account.
        </div>
      )}

      {/* Secondary action */}
      <button
        id="create-another-playlist-btn"
        onClick={onCreateAnother}
        className="text-sm font-medium transition-colors duration-150 cursor-pointer bg-transparent border-none"
        style={{ color: '#B3B3B3' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#B3B3B3')}
      >
        ← Create another playlist
      </button>
    </div>
  );
}
