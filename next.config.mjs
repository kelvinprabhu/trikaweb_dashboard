/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     "@mediapipe/pose": "node_modules/@mediapipe/pose",
  //     "@mediapipe/camera_utils": "node_modules/@mediapipe/camera_utils",
  //   };
  //   return config;
  // },
};

export default nextConfig;
