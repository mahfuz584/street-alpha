/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*", // Also support non-prefixed paths if needed
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        locale: false,
      },
      {
        source: "/backend-2/:path*",
        destination: `http://54.210.247.12:5000/:path*`,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
