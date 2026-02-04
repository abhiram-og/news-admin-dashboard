// Secure token storage utilities

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const storage = {
  // Access Token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Refresh Token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_KEY, token);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_KEY);
  },

  // User Data
  getUser: () => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: unknown): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  // Clear all auth data
  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
