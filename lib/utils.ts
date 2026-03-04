import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | undefined | null): string {
    if (!date) return 'N/A';
    try {
        const d = new Date(date);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(d);
    } catch {
        return 'Invalid Date';
    }
}

export function formatTime(date: string | Date | undefined | null): string {
    if (!date) return 'N/A';
    try {
        const d = new Date(date);
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(d);
    } catch {
        return 'Invalid Time';
    }
}

export function formatDateTime(date: string | Date | undefined | null): string {
    if (!date) return 'N/A';
    return `${formatDate(date)} ${formatTime(date)}`;
}
