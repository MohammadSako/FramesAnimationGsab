/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tree-shake big UI barrels so only the components we use get bundled.
  experimental: {
    optimizePackageImports: ["@heroui/react", "react-icons"],
  },
  // The 149 scroll frames (~23 MB) are static — let browsers cache them so
  // repeat visits don't re-download everything behind the preloader.
  async headers() {
    return [
      {
        source: "/avif/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
