/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/graphql', // Match requests starting with /api
                destination: 'https://leetcode.com/graphql', // Proxy to your API
            },
        ];
    },
}

module.exports = nextConfig
