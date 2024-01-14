'use client';

import { useAuth } from './provider';

export const Test = () => {
    const auth = useAuth();
    console.log(auth);
    return null;
};
