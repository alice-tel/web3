const TOKEN_KEY = 'memoryGameJWT';

export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}


export async function fetchWithAuth(input, init = {}) {
    const token = getToken();
    const headers = new Headers(init.headers || {});

    if (token) {
        headers.set('Authorization', 'Bearer ' + token);
    }

    return fetch(input, {
        ...init,
        headers
    });
}
