const os = require("os");

const localIPs = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface && iface.family === "IPv4")
  .map((iface) => iface.address);

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  allowedDevOrigins: Array.from(
    new Set(["localhost", "127.0.0.1", ...localIPs])
  ),
  async redirects() {
    return [
      {
        source: "/component",
        destination: "/",
        permanent: false
      },
      {
        source: "/ui",
        destination: "/",
        permanent: false
      },
      {
        source: "/heat-distortion",
        destination: "/playground/heat-distortion",
        permanent: false
      }
    ];
  }
};
