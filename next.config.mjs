/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  agentRules: false,
  serverExternalPackages: [
    "@tailwindcss/oxide",
    "@tailwindcss/oxide-win32-x64-msvc",
  ],
};

export default nextConfig;
