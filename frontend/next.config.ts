import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [
    {
      url: "/offline",
      revision: "1",
    },
  ],
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
          },{
            protocol: "https",
            hostname: "placehold.co",
            port: "",
            pathname: "/**"
          },{
            protocol: "https",
            hostname: "stoayeuztudofwpbqijf.supabase.co",
            port: "",
            pathname: "/**"
          }
        ],
      },
      // async rewrites() {
      //   return [
      //     {
      //       source: "/api/:path*",
      //       destination: "http://localhost:5000/:path*",
      //     },
      //   ];
      // },
};

export default withSerwist(nextConfig);
