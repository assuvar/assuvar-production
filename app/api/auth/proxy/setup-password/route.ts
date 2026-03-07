import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, password } = body;

        // Proxy to Backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
        const res = await fetch(`${backendUrl}/auth/setup-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier,
                password
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Setup Password Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
