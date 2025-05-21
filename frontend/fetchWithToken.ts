// app/fetchWithToken.ts
import {head} from "axios";

export function getTokenFromCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export async function fetchWithToken(
    input: RequestInfo,
    init: RequestInit = {}
): Promise<Response> {
    const token = getTokenFromCookie('token'); // replace 'token' with your cookie name
    const headers = new Headers(init.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    console.log('All headers:', [...headers.entries()])
    return fetch(input, {
        ...init,
        headers,
        credentials: 'include', // include cookies if needed by your API
    });
}
