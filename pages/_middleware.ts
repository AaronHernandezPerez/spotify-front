import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function getRoute(req: NextRequest, route: string) {
  const url = req.nextUrl.clone();
  url.pathname = route;
  return url;
}

export async function middleware(req: NextRequest) {
  // @ts-expect-error
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow the request, hack for svg
  if (pathname.includes("/api/auth") || token || pathname.endsWith(".svg")) {
    return NextResponse.next();
  } else if (!token && pathname !== "/login") {
    return NextResponse.redirect(getRoute(req, "/login"));
  }
}
