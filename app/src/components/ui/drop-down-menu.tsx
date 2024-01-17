'use client';

import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';

function useDropdownMenu() {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleToggle = useCallback(() => {
        setIsOpen((privState) => !privState);
    }, []);

    //su ly dieu chich vi chi cua menu
    useEffect(() => {
        if (!ref.current || !isOpen) return;

        const contentElement = ref.current.querySelector(
            '#DropdownMenuContent'
        ) as HTMLElement;

        if (!contentElement) return;

        contentElement.style.cssText =
            'display: block; opacity: 0; left: 50%; transform: translateX(-50%); ';

        const boundingRect = contentElement.getBoundingClientRect();

        const isOnTop =
            boundingRect.y + boundingRect.height > window.innerHeight;
        const isLeft = boundingRect.x < 25;
        const isRight =
            boundingRect.x + boundingRect.width > window.innerWidth - 25;

        contentElement.style.cssText = `display: block; opacity: 1; ${clsx({
            'bottom: 100%;': isOnTop,
            'top: 100%;': !isOnTop,
            'left: 0;': isLeft,
            'right: 0;': isRight,
            'left: 50%; transform: translateX(-50%);': !(isLeft || isRight),
        })}
        `;

        contentElement.onclick = () => {
            setTimeout(() => {
                handleClose();
            });
        };

        document.body.style.cssText = `pointer-events: none; touch-action: none;`;

        return () => {
            contentElement.style.cssText = '';
            document.body.style.cssText = '';
            contentElement.onclick = null;
        };
    }, [isOpen, handleClose]);

    useEffect(() => {
        function preventScroll(e: any) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        const handleClick = (e: MouseEvent) => {
            document.body.style.cssText = '';
            handleClose();
        };

        window.addEventListener('click', handleClick);

        if (!isOpen)
            return () => {
                window.removeEventListener('click', handleClick);
            };
        window.addEventListener('wheel', preventScroll, {
            passive: false,
        });

        return () => {
            window.removeEventListener('wheel', preventScroll);
        };
    }, [isOpen, handleClose]);

    return {
        isOpen,
        handleClose,
        handleOpen,
        handleToggle,
        ref,
    };
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
    const { ref, handleToggle } = useDropdownMenu();

    useEffect(() => {
        const triggerElement = ref.current?.querySelector(
            '#DropdownMenuTrigger'
        ) as HTMLElement;

        if (!triggerElement) return;

        triggerElement.onclick = (e) => {
            e.stopPropagation();

            handleToggle();
            return false;
        };
    }, [ref, handleToggle]);

    return (
        <div className="relative w-fit " ref={ref}>
            {children}
        </div>
    );
}

export function DropdownMenuTrigger({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div id="DropdownMenuTrigger" className={className}>
            {children}
        </div>
    );
}

export function DropdownMenuContent({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`hidden absolute z-[999] border-gray border ${className}`}
            id="DropdownMenuContent"
        >
            {children}
        </div>
    );
}

export function DropdownMenuItem({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className} style={{ pointerEvents: 'auto' }}>
            {children}
        </div>
    );
}

export function DropdownMenuLabel() {}
