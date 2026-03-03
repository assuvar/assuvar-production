import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, turnstileToken } = body;

        // Proxy to Backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${backendUrl}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                turnstileToken
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Send OTP Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
