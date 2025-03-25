/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.scdn.co", // Spotify
      "images.unsplash.com", // Unsplash
      "i.imgur.com", // Imgur
      "imgur.com",
      "picsum.photos", // Lorem Picsum
      "res.cloudinary.com", // Cloudinary
      "media.giphy.com", // Giphy
      "avatars.githubusercontent.com", // GitHub
      "raw.githubusercontent.com", // GitHub raw content
      "firebasestorage.googleapis.com", // Firebase Storage
      "storage.googleapis.com", // Google Cloud Storage
      "lh3.googleusercontent.com", // Google User Content
      "s3.amazonaws.com", // AWS S3
      "img.youtube.com", // YouTube thumbnails
      "i.pinimg.com", // Pinterest
      "pbs.twimg.com", // Twitter
      "cdn.discordapp.com", // Discord
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
