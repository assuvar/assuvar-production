'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

export function Select({ value, onValueChange, children }: SelectProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative w-full">{children}</div>
        </SelectContext.Provider>
    );
}

export function SelectTrigger({ children, className }: { children: React.ReactNode, className?: string }) {
    const context = React.useContext(SelectContext);
    if (!context) return null;

    return (
        <button
            type="button"
            onClick={() => context.setOpen(!context.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50 text-slate-500" />
        </button>
    );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
    const context = React.useContext(SelectContext);
    if (!context) return null;
    return <span>{context.value || placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
    const context = React.useContext(SelectContext);
    if (!context || !context.open) return null;

    return (
        <>
            <div className="fixed inset-0 z-[10001]" onClick={() => context.setOpen(false)} />
            <div className="absolute top-full left-0 z-[10002] mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in zoom-in-95 duration-200 origin-top">
                <div className="p-1">{children}</div>
            </div>
        </>
    );
}

export function SelectItem({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) {
    const context = React.useContext(SelectContext);
    if (!context) return null;

    const isSelected = context.value === value;

    return (
        <button
            type="button"
            onClick={() => {
                context.onValueChange(value);
                context.setOpen(false);
            }}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 transition-colors",
                isSelected ? "text-slate-900 font-bold" : "text-slate-600",
                className
            )}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            {children}
        </button>
    );
}
