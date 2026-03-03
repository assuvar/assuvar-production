import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, username, password, otp, turnstileToken } = body;

        // Proxy to Backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
        const res = await fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email || username,
                username: username || email,
                password,
                otp,
                turnstileToken
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        const token = data.token;
        const user = data.user || data; // Handle both structures

        // Create Response
        const response = NextResponse.json({ success: true, user });

        // Set HttpOnly Cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true, // Not accessible via JS
            secure: process.env.NODE_ENV === 'production', // Consistent with env
            sameSite: 'lax', // Allow top-level navigation
            path: '/',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        // Also set a visible cookie for client-side UI (optional, for name/role display)
        response.cookies.set('user_info', JSON.stringify(user), {
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 30
        });

        return response;

    } catch (error) {
        console.error('Login Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
