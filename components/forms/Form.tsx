'use client';

import React, { useState } from 'react';
import { useRouter } from '@/src/i18n/navigation';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    name: string;
    successRoute?: string;
    errorRoute?: string;
}

export function Form({ name, successRoute = '/success', errorRoute = '/error', children, className, ...props }: FormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData as any).toString(),
            });

            if (response.ok) {
                router.push(successRoute);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form Error:', error);
            router.push(errorRoute);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            name={name}
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className={className}
            {...props}
        >
            <input type="hidden" name="form-name" value={name} />
            <p className="hidden">
                <label>
                    Don’t fill this out if you’re human: <input name="bot-field" />
                </label>
            </p>
            {/* Pass loading state to children if they are functions, otherwise render normally */}
            {typeof children === 'function' ? children({ isLoading }) : children}
        </form>
    );
}
