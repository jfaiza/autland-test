import { NextResponse,  } from "next/server";
import { getServerSideProps, getValidators } from "./app/api/hello/route";


export async function middleware(request) {
  console.log("hello middleware");
  if (request.nextUrl.pathname === "/staking" || request.nextUrl.pathname === "/delegators") {
    return NextResponse.rewrite(new URL("/not-ready", request.url));
    // return NextResponse.redirect(new URL("/", request.url));
    // return NextResponse.next();
  }
}


// export const config = {
//   // matcher: "/delegators",
//   matcher: "/staking",
// };