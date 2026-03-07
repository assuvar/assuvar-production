import { cn } from "@/lib/utils";

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'special';

interface StatusBadgeProps {
    status: string;
    type?: StatusType;
    className?: string;
}

export function StatusBadge({ status, type = 'neutral', className }: StatusBadgeProps) {
    const styles: Record<string, string> = {
        success: "bg-green-100 text-green-700 border-green-200", // accepted
        warning: "bg-orange-100 text-orange-700 border-orange-200", // interested
        alert: "bg-yellow-100 text-yellow-800 border-yellow-300", // follow-up
        error: "bg-red-100 text-red-700 border-red-200", // rejected
        info: "bg-blue-100 text-blue-700 border-blue-200", // contacted
        neutral: "bg-gray-100 text-gray-700 border-gray-200", // new
        special: "bg-purple-100 text-purple-700 border-purple-200", // quoted
        indigo: "bg-indigo-100 text-indigo-700 border-indigo-200", // revision requested
    };

    let detectedType: string = type;
    if (type === 'neutral' && status) {
        const lowerStatus = status.toLowerCase();
        if (['accepted', 'won', 'completed', 'paid'].includes(lowerStatus)) detectedType = 'success';
        else if (['interested', 'pending', 'negotiation'].includes(lowerStatus)) detectedType = 'warning';
        else if (['follow_up', 'follow-up'].includes(lowerStatus)) detectedType = 'alert';
        else if (['rejected', 'cancelled', 'failed', 'lost', 'overdue'].includes(lowerStatus)) detectedType = 'error';
        else if (['contacted', 'sent'].includes(lowerStatus)) detectedType = 'info';
        else if (['revision_requested', 'revision-requested'].includes(lowerStatus)) detectedType = 'indigo';
        else if (['new', 'draft'].includes(lowerStatus)) detectedType = 'neutral';
        else if (['quoted'].includes(lowerStatus)) detectedType = 'special';
    }

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize whitespace-nowrap",
            styles[detectedType] || styles.neutral,
            className
        )}>
            {status === 'interested' ? 'quoted' : status.replace('_', ' ')}
        </span>
    );
}
