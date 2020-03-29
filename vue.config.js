// Copyright (c) 2018. Dirk Holtwick <holtwick.de>

const isProduction = process.env.NODE_ENV === 'production'

let config = {
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: `public/index.html`,
      filename: 'index.html',
    },
    jitsi: {
      entry: 'src/jitsi/main.js',
      template: `public/jitsi.html`,
      filename: 'jitsi.html',
    }
  },
}

if (isProduction) {

  // Path on GitHub Pages
  config.publicPath = `/dist`

  // Don't load workbox stuff from third party site
  config.pwa = {
    workboxOptions: {
      importWorkboxFrom: 'local',
      exclude: [/\.htaccess/],
      skipWaiting: true,
    },
  }
} else {

  config.devServer = {

    // Allow debugging from multiple devices in the local network
    disableHostCheck: true,

    // Some API (like WebRTC getUserMedia) is only allowed in secure context
    https: (process.env.HTTPS_OFF || '').toString() !== '1',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  }

}

module.exports = config
