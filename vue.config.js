// Copyright (c) 2018. Dirk Holtwick <holtwick.de>

const isProduction = process.env.NODE_ENV === 'production'

let config = {
  productionSourceMap: false,
  devServer: {},
}

if (isProduction) {
  config.publicPath = `peer2school/dist`
}

config.devServer.disableHostCheck = true

config.pwa = {
  workboxOptions: {
    importWorkboxFrom: 'local', // no workbox, we do it ourselves
    exclude: [/\.htaccess/],
    skipWaiting: true,
  },
}

module.exports = config
