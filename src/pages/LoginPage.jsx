import React from 'react';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '../utils/pkce';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = 'playlist-modify-public playlist-modify-private user-library-modify user-library-read';

/**
 * LoginPage — shown to unauthenticated users.
 * Initiates Spotify OAuth 2.0 PKCE flow on button click.
 */
export default function LoginPage() {
  const handleLogin = async () => {
    if (!CLIENT_ID) {
      alert('Spotify Client ID is not configured. Please check your .env file.');
      return;
    }

    // 1. Generate PKCE values
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    const state = generateState();

    // 2. Store verifier + state before redirect (must survive page navigation)
    sessionStorage.setItem('pkce_verifier', verifier);
    sessionStorage.setItem('pkce_state', state);

    // 3. Build authorization URL
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      state,
    });

    // 4. Redirect to Spotify
    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  };

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center px-6">
      {/* Floating orbs for depth */}
      <div
        className="fixed top-[-20%] left-[-10%] w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(29,185,84,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="fixed bottom-[-20%] right-[-10%] w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(29,185,84,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Card */}
      <div className="glass-card w-full max-w-md p-10 flex flex-col items-center gap-8 fade-in-up z-10">
        {/* Spotify logo mark */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: '#1DB954' }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#000">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>

        {/* Headline */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            AI Playlist Generator
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#B3B3B3' }}>
            Describe your mood and let AI build the perfect Spotify playlist for you — instantly.
          </p>
        </div>

        {/* Features */}
        <div className="w-full flex flex-col gap-3">
          {[
            { icon: '🤖', text: 'Powered by Google Gemini AI' },
            { icon: '🎵', text: 'Creates real playlists in your Spotify' },
            { icon: '⚡', text: 'Ready in seconds, no sign-up needed' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-lg">{icon}</span>
              <span className="text-sm" style={{ color: '#B3B3B3' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          id="connect-spotify-btn"
          onClick={handleLogin}
          className="btn-spotify w-full py-4 text-base"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Connect with Spotify
        </button>

        <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
          We only request permission to create playlists. We never read your existing library.
        </p>
      </div>
    </div>
  );
}
