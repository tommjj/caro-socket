'use client';

import {
    ChangeEventHandler,
    FormEventHandler,
    useCallback,
    useState,
} from 'react';
import { Logo } from './logo';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from './ui/use-toast';
import { http } from '@/lib/http';

interface InputProps extends React.HTMLProps<HTMLInputElement> {
    containerClassName?: string;
    label?: string;
}

export const Input = ({
    className,
    containerClassName = '',
    label,
    id,
    ...props
}: InputProps) => {
    return (
        <div className={cn('mt-7', containerClassName)}>
            {label ? (
                <label className="ml-1" htmlFor={id}>
                    {label}
                </label>
            ) : null}
            <input
                id={id}
                className={cn(
                    'py-2 w-full border rounded-md text-lg px-2 mt-2 bg-gray border-none',
                    className
                )}
                {...props}
            />
        </div>
    );
};

export const SignInForm = () => {
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        err: false,
    });
    const { push } = useRouter();

    const handleChangeUsername: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setFormState((s) => ({
                ...s,
                username: e.target.value,
                err: false,
            }));
        }, []);

    const handleChangePassword: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setFormState((s) => ({
                ...s,
                password: e.target.value,
                err: false,
            }));
        }, []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const [res, _] = await http.post.json('/api/auth/sign-in', formState, {
            method: 'POST',
        });

        if (res && res.ok) {
            return push('/');
        }
        setFormState((s) => ({ ...s, err: true }));
    };

    return (
        <>
            <form
                className="w-[420px] text-white"
                action=""
                onSubmit={handleSubmit}
            >
                <div className="text-white">
                    <Logo className="text-light" />
                    <h1 className="mt-8 text-4xl font-bold tracking-tight">
                        Sign in to your account
                    </h1>
                    <p>
                        Do not have an account?{' '}
                        <Link href={'sign-up'} className="text-light">
                            create an account
                        </Link>
                    </p>
                    <p className="text-red-500 px-1">
                        {formState.err ? 'username or password is wrong' : ''}
                    </p>
                </div>

                <div className="mt-2">
                    <Input
                        label="Username"
                        onChange={handleChangeUsername}
                        value={formState.username}
                        autoFocus
                        required
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        onChange={handleChangePassword}
                        value={formState.password}
                        required
                    />

                    <div className="w-full text-right py-1 px-1">
                        <a className="text-light">forget password?</a>
                    </div>
                    <div className="mt-7">
                        <button
                            type="submit"
                            className="py-2 w-full border rounded-md text-lg px-5 mt-2 text-white bg-light border-none"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export const SignUpForm = () => {
    const [formState, setFormState] = useState<{
        username: string;
        password: string;
        confirm: string;
        err: null | 'password' | 'username';
    }>({
        username: '',
        password: '',
        confirm: '',
        err: null,
    });
    const { push } = useRouter();

    const handleChangeUsername: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setFormState((s) => ({
                ...s,
                username: e.target.value,
                err: null,
            }));
        }, []);

    const handleChangePassword: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setFormState((s) => ({
                ...s,
                password: e.target.value,
                err: null,
            }));
        }, []);

    const handleChangeConfirm: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setFormState((s) => ({
                ...s,
                confirm: e.target.value,
                err: null,
            }));
        }, []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (formState.password !== formState.confirm)
            return setFormState((s) => ({ ...s, err: 'password' }));

        const [res, err] = await http.post.json('/api/users', {
            name: formState.username,
            password: formState.password,
        });

        if (!res || !res.ok)
            return setFormState((s) => ({ ...s, err: 'username' }));

        toast({
            title: 'Account created',
            description: new Date().toUTCString(),
            variant: 'success',
        });
        return push('/sign-in');
    };

    return (
        <>
            <form
                className="w-[420px] text-white"
                action=""
                onSubmit={handleSubmit}
            >
                <div>
                    <Logo className="" />
                    <h1 className="mt-8 text-4xl font-bold ">
                        Create an account
                    </h1>
                    <p>
                        Do you already have an account?{' '}
                        <Link href={'/sign-in'} className="text-light">
                            sign in
                        </Link>
                    </p>
                </div>

                <div className="mt-2">
                    <Input
                        label="Username"
                        onChange={handleChangeUsername}
                        value={formState.username}
                        autoFocus
                        required
                    />
                    <p className="text-red-500 px-1">
                        {formState.err && formState.err === 'username'
                            ? 'Username has already existed'
                            : ''}
                    </p>
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        onChange={handleChangePassword}
                        value={formState.password}
                        required
                    />
                    <p className="text-red-500 px-1">
                        {formState.err && formState.err === 'password'
                            ? 'Passwords are not matched'
                            : ''}
                    </p>
                    <Input
                        label="Confirm"
                        id="password"
                        type="password"
                        onChange={handleChangeConfirm}
                        value={formState.confirm}
                        required
                    />
                    <div className="mt-10">
                        <button
                            type="submit"
                            className="py-2 w-full border rounded-md text-lg px-5 mt-2 text-white bg-light border-none"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};
