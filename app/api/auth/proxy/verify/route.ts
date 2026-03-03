import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, username, code } = body;

        // Proxy to Backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${backendUrl}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({
                email: email || username,
                code
            }),
        });

        const data = await res.json();
        console.log(`[Proxy Verify] Backend status: ${res.status}`, data);

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Verify Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
