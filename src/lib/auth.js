// Simple cookie utility functions
export const setCookie = (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Admin credentials - in production, these should be in environment variables
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Store a simple auth token in cookie
        const authToken = btoa(`${username}:${Date.now()}`); // Simple encoding
        setCookie('admin_auth', authToken, 30); // 30 days
        return true;
    }
    return false;
};

export const isAuthenticated = () => {
    const authToken = getCookie('admin_auth');
    return authToken !== null;
};

export const logout = () => {
    deleteCookie('admin_auth');
};

