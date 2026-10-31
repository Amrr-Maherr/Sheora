const TOKEN_KEY = "sheora.auth.token";
const USER_KEY = "sheora.auth.user";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function getStoredUser<T>(): T | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setStoredUser<T>(user: T): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const setAuthUser = setStoredUser;
export const getAuthUser = getStoredUser;
