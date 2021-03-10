// auth0 functions for clientside
'use strict';

async function login() {
    const url = window.location.href;
    window.location.replace(url + 'auth/login/auth0');
}

async function logout() {
    const response = await fetch('auth/logout');
    if (response.ok) {
        console.log("Logged out.");
        window.location.reload();
    } else {
        console.error("Failed to log out.");
    }
}

/**
 * checks if the user has an authenticated session
 * @returns {boolean} true if authenticated
 */
async function checkAuth() {
    const response = await fetch('/auth/check');
    return response.ok;
}