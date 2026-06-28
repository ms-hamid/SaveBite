import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { resend_email_verif } from "./services/auth";

type Role = "ADMIN" | "MERCHANT" | "CUSTOMER";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(pathname)

  const token = request.cookies.get("sb_access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { role: Role, email_verified: boolean, kyc_status: string, email: string};
    console.log(decoded)

    // Authentichated login page check
    if (((pathname === "/login" || pathname === "/") && token) || (pathname === "/email-verification" && decoded.email_verified)) {
      if (decoded.role === "MERCHANT") return NextResponse.redirect(new URL("/m", request.url));
      if (decoded.role === "CUSTOMER") return NextResponse.redirect(new URL("/home", request.url));
      if (decoded.role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    }

    console.log(decoded.role)

    console.log(decoded)
    // // if user email not verified yet
    if (!decoded.email_verified) {
      // resend_email_verif(email);
      return NextResponse.redirect(new URL("/email-verification", request.url));
    }

    console.log("already verified")

    // if non admin user want to open admin page
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    // if non merchant user want to open admin page
    if (pathname.startsWith("/m") && decoded.role !== "MERCHANT") {

      return NextResponse.redirect(new URL("/403", request.url));
    }

    // if merchant havent verified yet
    if (decoded.role === "MERCHANT") {
      if (
        decoded.kyc_status === "pending" && pathname !== "/m/kyc-pending"){
        return NextResponse.redirect(new URL("/m/kyc-pending", request.url));
      }
    }

    return NextResponse.next();
  } catch (e){

    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/pay/:path*",
    "/admin/:path*",
    "/m/:path*",
    "/order/:path*",
    "/email-verification/",
    "/profile/:path*",
    "/saved/:path*"
  ]
}