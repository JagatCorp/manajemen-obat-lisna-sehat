// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/protected/:path*',
          destination: '/login',
          permanent: false,
        },
        // {
        //   source: '/test',
        //   destination: '/login',
        //   permanent: false,
        // },
      ];
    },
  };
  
  export default nextConfig;
  