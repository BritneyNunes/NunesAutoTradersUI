import { Base64 } from "js-base64";

export const API_URL = process.env.API_URL;

/**
 * Core fetch wrapper for all API calls.
 * - Automatically attaches the stored Basic Auth header, if present.
 * - Automatically sets JSON content-type for requests with a body.
 * - Throws an Error with the backend's message on non-2xx responses.
 * - Returns parsed JSON (or null for 204/404/empty responses).
 */
export async function apiFetch(path, options = {}) {
  const authHeader = sessionStorage.getItem("authHeader");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(authHeader ? { Authorization: authHeader } : {}),
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    throw new Error("Could not reach the server. Please check your connection.");
  }

  // Some of your GET routes (e.g. /cars, /contact) return 404 when the
  // collection is empty rather than an empty array — treat that as "no data"
  // instead of a hard error so callers can decide how to handle it.
  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch {
      // response wasn't JSON — fall through to generic message
    }
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return null;
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Builds a Basic Auth header value from email/password using the same
 * js-base64 encoding the backend expects, and stores it in sessionStorage
 * so subsequent apiFetch calls are authenticated.
 */
export function setAuthHeader(email, password) {
  const encoded = Base64.encode(`${email}:${password}`);
  const header = `Basic ${encoded}`;
  sessionStorage.setItem("authHeader", header);
  return header;
}

export function clearAuthHeader() {
  sessionStorage.removeItem("authHeader");
}