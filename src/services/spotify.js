/**
 * Spotify Web API service
 * Handles: user profile, track search, playlist creation, and adding tracks.
 */

const BASE = 'https://api.spotify.com/v1';

/**
 * Generic authenticated fetch wrapper.
 * Throws on non-ok responses with a meaningful message.
 */
async function spotifyFetch(url, accessToken, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  if (response.status === 401) {
    throw new Error('SPOTIFY_UNAUTHORIZED');
  }

  if (response.status === 403) {
    const err = await response.json().catch(() => ({}));
    if (err?.error?.message?.includes('premium')) {
      throw new Error('SPOTIFY_PREMIUM_REQUIRED');
    }
    throw new Error(err?.error?.message || 'Access Forbidden (403)');
  }

  if (!response.ok) {
    let message = `Spotify API error: ${response.status}`;
    try {
      const err = await response.json();
      message = err?.error?.message || message;
    } catch { /* ignore parse errors */ }
    throw new Error(message);
  }

  // 204 No Content (e.g. add tracks) returns no body
  if (response.status === 204) return null;
  return response.json();
}

/**
 * Gets the current user's Spotify ID.
 * @param {string} accessToken
 * @returns {Promise<string>} user ID
 */
export async function getCurrentUserId(accessToken) {
  const data = await spotifyFetch(`${BASE}/me`, accessToken);
  return data.id;
}

/**
 * Searches Spotify for a single track by title + artist.
 * Returns the track URI or null if not found.
 * @param {string} title
 * @param {string} artist
 * @param {string} accessToken
 * @returns {Promise<string|null>}
 */
export async function searchTrack(title, artist, accessToken) {
  const q = encodeURIComponent(`track:${title} artist:${artist}`);
  const url = `${BASE}/search?q=${q}&type=track&limit=1`;
  const data = await spotifyFetch(url, accessToken);
  const items = data?.tracks?.items;
  if (!items || items.length === 0) return null;
  return items[0].uri;
}

/**
 * Searches for all tracks sequentially (not parallel) to avoid rate limits.
 * Skips tracks that return no results.
 * @param {Array<{title: string, artist: string}>} tracks
 * @param {string} accessToken
 * @param {function} onProgress - Called with (current, total) after each search
 * @returns {Promise<string[]>} Array of Spotify track URIs
 */
export async function searchAllTracks(tracks, accessToken, onProgress) {
  const uris = [];
  for (let i = 0; i < tracks.length; i++) {
    const { title, artist } = tracks[i];
    try {
      const uri = await searchTrack(title, artist, accessToken);
      if (uri) {
        uris.push(uri);
      } else {
        console.log(`[Spotify] Skipped (not found): "${title}" by ${artist}`);
      }
    } catch (err) {
      if (err.message === 'SPOTIFY_UNAUTHORIZED') throw err;
      console.warn(`[Spotify] Error searching "${title}": ${err.message}`);
    }
    if (onProgress) onProgress(i + 1, tracks.length);
  }
  return uris;
}

/**
 * Creates a new private playlist for the user.
 * @param {string} userId
 * @param {string} name
 * @param {string} description
 * @param {string} accessToken
 * @returns {Promise<{id: string, external_urls: {spotify: string}}>}
 */
export async function createPlaylist(userId, name, description, accessToken) {
  const url = `${BASE}/users/${userId}/playlists`;
  const body = {
    name,
    description,
    public: false, // Changed to false for better compatibility with Free accounts
  };
  return spotifyFetch(url, accessToken, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Adds track URIs to an existing playlist.
 * Batches in chunks of 100 (Spotify limit).
 * @param {string} playlistId
 * @param {string[]} uris
 * @param {string} accessToken
 */
export async function addTracksToPlaylist(playlistId, uris, accessToken) {
  const CHUNK = 100;
  for (let i = 0; i < uris.length; i += CHUNK) {
    const batch = uris.slice(i, i + CHUNK);
    await spotifyFetch(`${BASE}/playlists/${playlistId}/tracks`, accessToken, {
      method: 'POST',
      body: JSON.stringify({ uris: batch }),
    });
  }
}
