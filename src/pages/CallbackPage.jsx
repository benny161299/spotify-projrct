import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

/**
 * CallbackPage — handles the OAuth redirect from Spotify.
 * Exchanges the authorization code for an access token (PKCE, no client secret).
 * Runs exactly once on mount.
 */
export default function CallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const didRun = useRef(false);

  useEffect(() => {
    // Prevent double-execution in React StrictMode
    if (didRun.current) return;
    didRun.current = true;

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const returnedState = params.get('state');
      const error = params.get('error');

      // Check for denied access
      if (error) {
        navigate('/?error=access_denied');
        return;
      }

      if (!code) {
        navigate('/?error=no_code');
        return;
      }

      // Retrieve stored PKCE values
      const storedState = sessionStorage.getItem('pkce_state');
      const verifier = sessionStorage.getItem('pkce_verifier');

      // CSRF check
      if (returnedState !== storedState) {
        navigate('/?error=state_mismatch');
        return;
      }

      if (!verifier) {
        navigate('/?error=no_verifier');
        return;
      }

      // Exchange code for token
      try {
        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: verifier,
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error_description || `Token exchange failed: ${response.status}`);
        }

        const data = await response.json();

        // Clean up sessionStorage
        sessionStorage.removeItem('pkce_verifier');
        sessionStorage.removeItem('pkce_state');

        // Store token globally and redirect
        login(data.access_token);
        navigate('/create');
      } catch (err) {
        console.error('[Callback] Token exchange error:', err);
        navigate(`/?error=${encodeURIComponent(err.message)}`);
      }
    };

    handleCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="gradient-bg min-h-screen flex flex-col items-center justify-center gap-6"
    >
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin-slow"
          style={{ borderTopColor: '#1DB954', borderRightColor: 'rgba(29,185,84,0.3)' }}
        />
      </div>
      <p className="text-white font-medium">Connecting to Spotify…</p>
    </div>
  );
}
