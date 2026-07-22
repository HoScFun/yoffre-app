/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Domaines secondaires → canonique yoffre.fr (Vercel le faisait au niveau
      // plateforme ; ici c'est l'app qui porte la redirection 308)
      {
        source: "/:path*",
        has: [{ type: "host", value: "yoffre.com" }],
        destination: "https://yoffre.fr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.yoffre.com" }],
        destination: "https://yoffre.fr/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.yoffre.fr" }],
        destination: "https://yoffre.fr/:path*",
        permanent: true,
      },
      // Ancienne URL CGV → CGU (le service est gratuit, plus de "vente")
      { source: "/cgv", destination: "/cgu", permanent: true },
      { source: "/tarifs", destination: "/", permanent: true },
      { source: "/ressources", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
