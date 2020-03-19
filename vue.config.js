// Copyright (c) 2018. Dirk Holtwick <holtwick.de>

const isProduction = process.env.NODE_ENV === 'production'

let config = {
  productionSourceMap: false,
}

if (isProduction) {

  // Path on GitHub Pages
  config.publicPath = `/peer2school/dist`

  // Don't load workbox stuff from third party site
  config.pwa = {
    workboxOptions: {
      importWorkboxFrom: 'local',
      exclude: [/\.htaccess/],
      skipWaiting: true,
    },
  }
} else {

  // Allow debugging from multiple devices in the local network
  config.devServer = {
    disableHostCheck: true,
  }

}

module.exports = config
