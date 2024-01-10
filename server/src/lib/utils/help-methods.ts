import { sign, unsign } from 'cookie-signature';
import { parse } from 'cookie';
import { SECRET_KEY } from './constant';

export const signCookie = (data: string | object) => {
    const str = typeof data === 'string' ? data : JSON.stringify(data);

    return sign(str, SECRET_KEY);
};

export const unsignCookie = (cookie: string | undefined) => {
    if (typeof cookie === 'undefined') return;

    return unsign(cookie, SECRET_KEY);
};

export const getCookieString = (
    cookie: string | undefined,
    key: string,
    secret: boolean = false
) => {
    if (!cookie) return undefined;

    const cookieData = parse(cookie)[key];

    if (!cookieData) return undefined;

    return secret ? unsignCookie(cookieData) : cookieData;
};
