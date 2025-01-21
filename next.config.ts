import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: ["assets.aceternity.com",'res.cloudinary.com'], // Add your external domain here
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'df6y0s9sx', // Replace with your Cloudinary cloud name
  },
};

export default nextConfig;
