import React, { forwardRef } from 'react';
import { cn } from '@/src/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: "bg-structura-blue text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20",
            secondary: "bg-structura-black text-white hover:bg-slate-800",
            outline: "border-2 border-structura-blue text-structura-blue hover:bg-blue-50"
        };

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-structura-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    variants[variant],
                    className
                )}
                disabled={disabled || isLoading}
                ref={ref}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
