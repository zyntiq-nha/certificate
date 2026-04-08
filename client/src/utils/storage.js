const TOKEN_KEY = "zyntiq_admin_token";
const ADMIN_KEY = "zyntiq_admin_info";

export const tokenStorage = {
  get() {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(value) {
    localStorage.setItem(TOKEN_KEY, value);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const adminStorage = {
  get() {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  set(value) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(value));
  },
  clear() {
    localStorage.removeItem(ADMIN_KEY);
  }
};
