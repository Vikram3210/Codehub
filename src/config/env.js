// src/config/env.js
// Single source of truth for API and WebSocket URLs.
// Set VITE_API_URL in .env (dev: http://localhost:5000, prod: https://your-backend.onrender.com)

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** Base URL for all REST API calls (always includes /api) */
export const API_BASE = `${API_ORIGIN}/api`;

/** WebSocket server URL (same origin as API, no path) */
export const SOCKET_URL = API_ORIGIN;
