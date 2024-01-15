import { User } from './zod.schema';

const host = process.env.NEXT_PUBLIC_ORIGIN_API || 'http://localhost:8080';

const createMethods = (
    dfPath: string | URL | Request = '',
    init: RequestInit = {}
) => {
    const method = async (
        path: string = '',
        requestInit: RequestInit = {}
    ): Promise<[undefined, unknown] | [Response, undefined]> => {
        try {
            const res = await fetch(`${dfPath}${path}`, {
                ...init,
                ...requestInit,
            });
            return [res, undefined];
        } catch (error) {
            return [undefined, error];
        }
    };

    method.json = async (
        path: string = '',
        body: object,
        requestInit: RequestInit = init
    ): Promise<[undefined, unknown] | [Response, undefined]> => {
        try {
            const res = await fetch(`${dfPath}${path}`, {
                ...init,
                ...requestInit,
                headers: {
                    ...init.headers,
                    ...requestInit.headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            return [res, undefined];
        } catch (error) {
            return [undefined, error];
        }
    };
    return method;
};

class Fetcher {
    get;
    post;
    delete;
    put;
    patch;
    constructor(input: string | URL | Request = '', init: RequestInit = {}) {
        this.get = createMethods(input, { ...init, method: 'GET' });
        this.post = createMethods(input, { ...init, method: 'POST' });
        this.put = createMethods(input, { ...init, method: 'PUT' });
        this.patch = createMethods(input, { ...init, method: 'PATCH' });
        this.delete = createMethods(input, { ...init, method: 'DELETE' });
    }
}

class Http extends Fetcher {
    constructor(input: string | URL | Request = '', init: RequestInit) {
        super(input, init);
    }

    async getToken(): Promise<{ token: string } | undefined> {
        const [res, err] = await this.get('/api/auth/token');

        if (!res) return undefined;
        if (res.ok) {
            return await res.json();
        }
        return;
    }

    async getUser(): Promise<User | undefined> {
        const [res, err] = await this.get('/api/auth');
        if (!res) return undefined;
        if (res.ok) {
            return (await res.json()) as User;
        }
        return undefined;
    }
}

export const fetcher = new Fetcher(host, { credentials: 'include' });
export const http = new Http(host, { credentials: 'include' });
