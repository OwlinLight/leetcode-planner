/** @type {import('next').NextConfig} */
const nextConfig = {
	// proxy to bypass CORS policy of browser
	async rewrites() {
		return [
			{
				source: "/graphql", // local api path you should request
				destination: "https://leetcode.com/graphql", // forward to leetcode
			},
		];
	},
};

module.exports = nextConfig;
