import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
    title: "Assuvar OS",
    description: "Unified Internal Operating System",
};

import { Toaster } from 'sonner';

export default function OSLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-structura-light text-structura-black font-sans`}>
                <Toaster richColors position="top-right" />
                {children}
            </body>
        </html>
    );
}
