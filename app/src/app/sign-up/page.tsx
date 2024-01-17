import { SignUpForm } from '@/components/sign-in-up-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'sign up',
};

export default function SignUpPage() {
    return (
        <main className="flex h-svh w-screen bg-dark">
            <div className="w-full md:w-6/12 h-full flex justify-center items-center">
                <SignUpForm />
            </div>
            <div className="w-6/12 h-full justify-center items-center hidden md:flex">
                <div className="w-[453px] h-[453px] relative">
                    <span className="block w-[28px] h-full -translate-x-1/2 rounded-full absolute left-1/3 bg-gray"></span>
                    <span className="block w-[28px] h-full -translate-x-1/2 rounded-full absolute left-2/3 bg-gray"></span>

                    <span className="block w-full h-[28px] -translate-y-1/2 rounded-full absolute top-1/3 bg-gray"></span>
                    <span className="block w-full h-[28px] -translate-y-1/2 rounded-full absolute top-2/3 bg-gray"></span>
                </div>
            </div>
        </main>
    );
}
