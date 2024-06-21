import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
//   const origin = request.headers.get("origin");
  const token = cookies().get("token");

  if (!token) return NextResponse.redirect(new URL("/", request.url));

try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secretKey);
    
    const { role } = payload;
  
    if (
      (request.url.includes("/video/") && role === "user") ||
      (request.url.includes("/admin/dashboard/") && role === "admin")
    ) {
      return NextResponse.next();
    }
} catch (error) {
    if(request.url.includes("/admin/")) {
        return NextResponse.redirect(new URL("/admin", request.url))
    }else{
        return NextResponse.redirect(new URL("/", request.url)) 
    }
}
}

export const config = {
  matcher: ["/video/:path*", "/admin/dashboard:path*"],
};
