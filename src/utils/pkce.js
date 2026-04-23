/**
 * PKCE (Proof Key for Code Exchange) helpers
 * Used for secure OAuth 2.0 flow without a backend server.
 */

/**
 * Generates a cryptographically random string for the code verifier.
 * Length ~96 chars (64 random bytes → base64url).
 */
export function generateCodeVerifier() {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64urlEncode(array);
}

/**
 * Derives the code_challenge from the verifier using SHA-256.
 * @param {string} verifier
 * @returns {Promise<string>}
 */
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(new Uint8Array(digest));
}

/**
 * Generates a random state string to prevent CSRF.
 */
export function generateState() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64urlEncode(array);
}

/**
 * Encodes a Uint8Array to a base64url string (URL-safe, no padding).
 * @param {Uint8Array} buffer
 * @returns {string}
 */
function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
