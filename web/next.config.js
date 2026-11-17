const os = require("os");

const localIPs = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface && iface.family === "IPv4")
  .map((iface) => iface.address);

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  allowedDevOrigins: Array.from(
    new Set(["192.168.20.6", "localhost", "127.0.0.1", ...localIPs])
  )
};
