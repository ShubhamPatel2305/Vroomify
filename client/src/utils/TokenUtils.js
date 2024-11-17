/* eslint-disable no-unused-vars */
// src/utils/tokenUtils.js

class TokenStorage {
    static getStorageKey(key) {
      // Check all possible domain variations
      const domains = [
        window.location.origin,
        'https://roomifyclient.vercel.app'
      ];
  
      for (const domain of domains) {
        const value = localStorage.getItem(key);
        if (value) return value;
      }
      return null;
    }
  
    static setStorageKey(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.error(`Error storing ${key}:`, error);
        return false;
      }
    }
  
    static removeStorageKey(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error removing ${key}:`, error);
        return false;
      }
    }
  }
  
  export const setUserData = (email, username, token) => {
    TokenStorage.setStorageKey('email', email);
    TokenStorage.setStorageKey('username', username);
    TokenStorage.setStorageKey('token', token);
  };
  
  export const getUserData = () => {
    return {
      email: TokenStorage.getStorageKey('email'),
      username: TokenStorage.getStorageKey('username'),
      token: TokenStorage.getStorageKey('token')
    };
  };
  
  export const clearUserData = () => {
    TokenStorage.removeStorageKey('email');
    TokenStorage.removeStorageKey('username');
    TokenStorage.removeStorageKey('token');
  };