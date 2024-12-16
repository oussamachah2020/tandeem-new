/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        minimumCacheTTL: 0
    },
    pageExtensions: ['ts', 'tsx']
}

module.exports = nextConfig
