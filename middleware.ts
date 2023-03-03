import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;
        console.log(url, 'que se envia')
        return NextResponse.redirect(url);
        /*
        return new Response(JSON.stringify({ message: 'no authorize' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        */
    }

    const validRoles = ['admin', 'super-user', 'SEO']

    if (!validRoles.includes(session.user.role)) {
        return NextResponse.redirect(new URL('/', req.url));

        /*
            return new Response(JSON.stringify({ message: 'no authorize' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        */
    }

    return NextResponse.next();
}


// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/checkout/address', '/checkout/summary', '/admin']
};

/*
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    // const { token = '' } = req.cookies as unknown as { token: string }
    const token = req.cookies.get('token')
    // const token = req.cookies.get('token') || ''

    try {
        await jose.jwtVerify(token?.value || '', new TextEncoder().encode(process.env.JWT_SECRET_SEED || ""))
        return NextResponse.next()
    } catch (error) {
        const { pathname, host, protocol } = req.nextUrl
        console.log(`/auth/login?p=${pathname}`)
        return NextResponse.redirect(
        `${protocol}//${host}/auth/login?p=${pathname}`
        );
    }
}

// Only the paths declared in here will run the middleware
export const config = {
    matcher: ["/checkout/address", "/checkout/summary"],
};
*/