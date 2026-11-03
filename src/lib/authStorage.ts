const TOKEN_KEY = "sheora.auth.token";
const USER_KEY = "sheora.auth.user";
const AUTH_EVENT = "sheora:auth-changed";

function notifyAuthChanged(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

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
  notifyAuthChanged();
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChanged();
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}

export function getStoredUserRaw(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
}

export function subscribeToAuth(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", listener);
  window.addEventListener(AUTH_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(AUTH_EVENT, listener);
  };
}

export function getStoredUser<T>(): T | null {
  const raw = getStoredUserRaw();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStoredUser<T>(user: T): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChanged();
}

export const setAuthUser = setStoredUser;
export const getAuthUser = getStoredUser;
