import { cn } from "@/lib/utils";

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
    status: string;
    type?: StatusType;
    className?: string;
}

export function StatusBadge({ status, type = 'neutral', className }: StatusBadgeProps) {
    const styles = {
        success: "bg-green-100 text-green-700 border-green-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        error: "bg-red-100 text-red-700 border-red-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
        neutral: "bg-slate-100 text-slate-600 border-slate-200",
    };

    // Auto-detect based on common keywords if type is default
    let detectedType = type;
    if (type === 'neutral' && status) {
        const lowerStatus = status.toLowerCase();
        if (['active', 'paid', 'completed', 'won', 'approved'].includes(lowerStatus)) detectedType = 'success';
        else if (['pending', 'processing', 'negotiation', 'contacted'].includes(lowerStatus)) detectedType = 'warning';
        else if (['rejected', 'cancelled', 'failed', 'lost', 'overdue'].includes(lowerStatus)) detectedType = 'error';
        else if (['new', 'draft', 'sent'].includes(lowerStatus)) detectedType = 'info';
    }

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            styles[detectedType],
            className
        )}>
            {status}
        </span>
    );
}
