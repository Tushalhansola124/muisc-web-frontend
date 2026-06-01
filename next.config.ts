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

}

export default nextConfig