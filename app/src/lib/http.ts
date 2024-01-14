import { User } from './zod.schema';

const host = process.env.NEXT_PUBLIC_ORIGIN_API || 'http://localhost:8080';

class Http {
    host = '';
    constructor(host: string = '') {
        this.host = host;
    }

    json(input: string | URL | Request, body: object, init?: RequestInit) {
        return fetch(`${host}${input}`, {
            ...init,
            headers: { 'Content-Type': 'application/json', ...init?.headers },
            credentials: 'include',
            body: JSON.stringify(body),
        });
    }

    get(input: string | URL | Request, init?: RequestInit) {
        return fetch(`${host}${input}`, {
            ...init,
            method: 'GET',
            credentials: 'include',
        });
    }

    async getToken(): Promise<{ token: string }> {
        return await (await http.get('/api/auth/token')).json();
    }

    async getUser(): Promise<User | undefined> {
        const res = await http.get('/api/auth');
        if (res.ok) {
            return (await res.json()) as User;
        }
        return undefined;
    }
}

export const http = new Http(host);
