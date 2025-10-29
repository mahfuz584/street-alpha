import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET;

export async function middleware(req) {
  const token = await getToken({ req, secret });
  const path = req.nextUrl.pathname;

  if (path === "/signin" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};
