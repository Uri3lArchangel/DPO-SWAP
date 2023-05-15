/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains:[
      "tokens.1inch.io"
    ]
  },
  reactStrictMode: true,
  webpack5:true,
  webpack:(config)=>{
    config.resolve.fallback={fs:false}
    return config;
  },
 
}

module.exports = nextConfig
