import { SignUpForm } from '@/components/sign-in-up-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'sign in',
};

export default function SignInPage() {
    return (
        <main className="flex h-svh w-screen">
            <div className="w-full md:w-6/12 h-full flex justify-center items-center ">
                <SignUpForm />
            </div>
            <div className="w-6/12 h-full justify-center items-center hidden md:flex">
                <div className="w-[453px] h-[453px] relative">
                    <span className="block w-[1px] h-full absolute left-1/3 bg-gradient-to-b from-gray-500 via-gray-800 to-gray-500"></span>
                    <span className="block w-[1px] h-full absolute left-2/3 bg-gradient-to-b from-gray-500 via-gray-800 to-gray-500"></span>

                    <span className="block w-full h-[1px] absolute top-1/3 bg-gradient-to-r from-gray-500 via-gray-800 to-gray-500"></span>
                    <span className="block w-full h-[1px] absolute top-2/3 bg-gradient-to-r from-gray-500 via-gray-800 to-gray-500"></span>
                </div>
            </div>
        </main>
    );
}
