const os = require("os");
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const localIPs = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface && iface.family === "IPv4")
  .map((iface) => iface.address);

/** @param {string} phase */
module.exports = (phase) => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
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
      },
      {
        source: "/paper-burn",
        destination: "/playground/paper-burn",
        permanent: false
      }
    ];
  }
});
