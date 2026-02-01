import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // Just pass through - no locale handling here
  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next (Next.js internals)
  // - static files (e.g., favicon.ico, images, etc.)
  matcher: [
    '/((?!api|_next|.*\\..*).*)'
  ]
};
