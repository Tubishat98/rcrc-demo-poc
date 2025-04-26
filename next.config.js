module.exports = {
    env: {
        BASE_URL: process.env.API_URI,
      },
        reactStrictMode: false,
        'fontawesome-svg-core': {
          license: 'free'
        },
        images: {
          remotePatterns: [
            {
              protocol: "https",
              hostname: "i.ibb.co",
            },
            {
              protocol: "https",
              hostname: "https://www.pexels.com/",
            },
          ],
        },
     
  }