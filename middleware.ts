import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/admin",
  ];

  const authRoutes = [
    "/login",
    "/signup",
  ];

  const pathname = req.nextUrl.pathname;

  // Protected Routes
  const isProtectedRoute =
    protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

  if (
    isProtectedRoute &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // Prevent logged user from login page
  const isAuthRoute =
    authRoutes.includes(pathname);

  if (
    isAuthRoute &&
    isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};