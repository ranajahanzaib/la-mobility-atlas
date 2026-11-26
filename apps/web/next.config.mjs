/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    "@la-mobility-atlas/contracts",
    "@la-mobility-atlas/design-tokens",
    "@la-mobility-atlas/visualization",
  ],
};

export default nextConfig;
