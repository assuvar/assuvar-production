import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div className={cn("card-enterprise rounded-xl bg-white", className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }: CardProps) {
    return (
        <div className={cn("border-b border-structura-border px-6 py-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className, ...props }: CardProps) {
    return (
        <h3 className={cn("text-lg font-semibold text-structura-black font-display", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className, ...props }: CardProps) {
    return (
        <div className={cn("p-6", className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className, ...props }: CardProps) {
    return (
        <div className={cn("px-6 py-4 border-t border-structura-border", className)} {...props}>
            {children}
        </div>
    );
}
