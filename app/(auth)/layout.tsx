import Image from "next/image";
import "../globals.css"; // Import styles
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space-grotesk' });

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans`}>
                <div className="min-h-screen w-full relative flex items-center justify-center bg-structura-light overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-structura-blue/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-structura-amber/5 rounded-full blur-3xl animate-pulse delay-1000" />

                    <div className="relative z-10 w-full max-w-md p-4">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-structura-border flex items-center justify-center mb-4">
                                <Image
                                    src="/assets/logo.svg"
                                    alt="Assuvar Logo"
                                    width={42}
                                    height={42}
                                />
                            </div>
                            <span className="sr-only">Assuvar</span>
                            <Image
                                src="/assets/assuvar-wordmark.svg"
                                alt="Assuvar"
                                width={173}
                                height={30}
                                className="h-6 w-auto"
                            />
                        </div>

                        {children}

                        <div className="mt-8 text-center text-xs text-slate-400">
                            &copy; 2024 Structura IT. All rights reserved.
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
