import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

        // Clear HttpOnly Cookies
        const cookieStore = await cookies();

        cookieStore.set('auth_token', '', {
            path: '/',
            maxAge: 0, // Expire immediately
        });

        cookieStore.set('user_info', '', {
            path: '/',
            maxAge: 0, // Expire immediately
        });

        return response;
    } catch (error) {
        console.error('Logout Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
