import { create } from 'zustand';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'tesla_auth_tokens';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  masterPassword: null,

  // Initialize store from localStorage if available
  initAuth: (password) => {
    try {
      const encryptedData = localStorage.getItem(STORAGE_KEY);
      if (!encryptedData) return false;

      const bytes = CryptoJS.AES.decrypt(encryptedData, password);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedData) return false; // Incorrect password or corrupted data

      const { accessToken, refreshToken } = JSON.parse(decryptedData);

      set({
        isAuthenticated: true,
        accessToken,
        refreshToken,
        masterPassword: password
      });
      return true;
    } catch (error) {
      console.error("Authentication failed", error);
      return false;
    }
  },

  login: (accessToken, refreshToken, password) => {
    try {
      const dataToEncrypt = JSON.stringify({ accessToken, refreshToken });
      const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, password).toString();

      localStorage.setItem(STORAGE_KEY, encryptedData);

      set({
        isAuthenticated: true,
        accessToken,
        refreshToken,
        masterPassword: password
      });
      return true;
    } catch (error) {
      console.error("Encryption failed", error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      masterPassword: null
    });
  },

  hasStoredTokens: () => {
    return !!localStorage.getItem(STORAGE_KEY);
  }
}));
