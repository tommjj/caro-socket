'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import Button, { Variant } from './button';

const Context = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export default function AlertDialog(props: any) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Context.Provider value={[isOpen, setIsOpen]}>
            {props.children}
        </Context.Provider>
    );
}

export function AlertDialogTrigger({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [, setIsOpen] = useContext(Context)!;

    return (
        <div
            className="w-fit"
            onClick={(e) => {
                setIsOpen((prevState) => !prevState);
            }}
        >
            {children}
        </div>
    );
}

export function AlertDialogContent({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useContext(Context)!;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function preventScroll(e: any) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        window.addEventListener('wheel', preventScroll, {
            passive: false,
        });

        return () => {
            window.removeEventListener('wheel', preventScroll);
        };
    }, [isOpen]);

    return (
        <>
            {isOpen
                ? createPortal(
                      <div
                          ref={ref}
                          className="backdrop-blur-md shadow-md shadow-[#00000040] flex justify-center items-center fixed w-screen h-screen top-0 left-0 bg-[#11111160] z-[999] animate-loaded"
                          onClick={(e) => {
                              if (ref.current === e.target) setIsOpen(false);
                          }}
                          style={{ pointerEvents: 'auto' }}
                      >
                          <div className="flex flex-col w-full pt-4 bg-dark h-[35%] text-white">
                              {children}
                          </div>
                      </div>,
                      document.body
                  )
                : null}
        </>
    );
}

export function AlertDialogHeader({
    children,
}: {
    children?: React.ReactNode;
}) {
    return <div className="flex-grow px-6">{children}</div>;
}

export function AlertDialogTitle({ children }: { children?: React.ReactNode }) {
    return <div className=" font-semibold text-6xl">{children}</div>;
}

export function AlertDialogDescription({
    children,
}: {
    children?: React.ReactNode;
}) {
    return (
        <div className="flex-grow">
            <p className="pt-2 font-normal text-base">{children}</p>
        </div>
    );
}

export function AlertDialogFooter({
    children,
}: {
    children?: React.ReactNode;
}) {
    return <div className="flex justify-end pt-4">{children}</div>;
}

export function AlertDialogCancel({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [, setIsOpen] = useContext(Context)!;
    return (
        <button
            onClick={() => {
                setIsOpen(false);
            }}
            className="py-2 bg-light w-[50%]"
        >
            {children}
        </button>
    );
}

export function AlertDialogAction({
    children,
    action,
    asChild = false,
    variant = 'dark',
}: {
    children?: React.ReactNode;
    action?: () => void;
    asChild?: boolean;
    variant?: Variant;
}) {
    const [, setIsOpen] = useContext(Context)!;
    return (
        <>
            {!asChild ? (
                <Button
                    onClick={() => {
                        action && action();
                        setIsOpen(false);
                    }}
                    variant="destructive"
                    className="py-1 ml-2"
                >
                    {children}
                </Button>
            ) : (
                <div
                    className=" w-[50%] border-t border-light"
                    onClick={() => {
                        setTimeout(() => {
                            setIsOpen(false);
                        });
                    }}
                >
                    {children}
                </div>
            )}
        </>
    );
}
