'use client';

import { useContext, createContext, useState, useLayoutEffect } from 'react';

const AuthContext = createContext<
    { id: string; name: string } | undefined | 'load'
>(undefined);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
    const [user, setUser] = useState<
        { id: string; name: string } | 'load' | undefined
    >('load');

    useLayoutEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_ORIGIN_API}/api/auth`, {
            method: 'GET',
            credentials: 'include',
        }).then(async (res) => {
            if (res.ok) {
                setUser(await res.json());
            } else {
                setUser(undefined);
            }
        });
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = ():
    | [undefined, true]
    | [{ id: string; name: string } | undefined | undefined, false] => {
    const user = useContext(AuthContext);

    if (user === 'load') {
        return [undefined, true];
    }
    return [user, false];
};
