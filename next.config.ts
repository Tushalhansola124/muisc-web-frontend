const nextConfig = {

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  serverExternalPackages: [],

  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
  allowedDevOrigins: ["10.94.132.178"],

}

export default nextConfig