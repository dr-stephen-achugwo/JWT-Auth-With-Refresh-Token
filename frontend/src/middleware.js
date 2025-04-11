import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const pathname = request.nextUrl.pathname;

  if (!refreshToken) {
    const response = NextResponse.next();

    response.cookies.delete("accessToken");

    if (
      pathname === "/" ||
      pathname === "/auth/login" ||
      pathname === "/auth/register"
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    (accessToken && pathname === "/") ||
    pathname === "/auth/login" ||
    pathname === "/auth/register"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
    "/profile",
    "/users",
  ],
};
