/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/graphql', // request local api
                destination: 'https://leetcode.com/graphql', // forward to leetcode
            },
        ];
    },
}

module.exports = nextConfig
