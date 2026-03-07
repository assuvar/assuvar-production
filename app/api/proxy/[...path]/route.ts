import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function handleRequest(request: Request, path: string[], method: string) {
    try {
        const resolvedPath = path.join('/');

        // Get HttpOnly Secure Cookie
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No session token.' }, { status: 401 });
        }

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
        const { search } = new URL(request.url);

        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };

        if (method !== 'GET' && method !== 'DELETE') {
            const body = await request.json().catch(() => ({}));
            fetchOptions.body = JSON.stringify(body);
        }

        const res = await fetch(`${backendUrl}/${resolvedPath}${search}`, {
            ...fetchOptions,
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error(`Proxy Error (${method}):`, error);
        return NextResponse.json({ message: 'Internal Proxy Error' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(request, path, 'GET');
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(request, path, 'POST');
}

export async function PATCH(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(request, path, 'PATCH');
}

export async function PUT(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(request, path, 'PUT');
}

export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return handleRequest(request, path, 'DELETE');
}
