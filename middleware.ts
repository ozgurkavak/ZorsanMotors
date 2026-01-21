import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check for admin path
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const adminSession = request.cookies.get('admin_session')

        if (!adminSession) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
}

export const config = {
    matcher: '/admin/:path*',
}
