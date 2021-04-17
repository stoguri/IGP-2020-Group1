export const login = async () => {
    const response = await fetch('http://localhost:8080/auth/login/auth0');
    if (response.ok) {
        return true;
    } else {
        return false;
    }
}


export const logout = async () => {
    const response = await fetch('http://localhost:8080/auth/logout');
    if (response.ok) {
        return true;
    } else {
        return false;
    }
}

/**
 * checks if the user has an authenticated session
 * @returns {boolean} true if authenticated
 */
export const checkAuth = async () => {
    const response = await fetch('http://localhost:8080/auth/check');
    return response.ok;
}