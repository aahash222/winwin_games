module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      fallback: { path: require.resolve('path-browserify') }
    }
  },
  css: {
    loaderOptions: {
      css: {
        url: {
          filter: (url, resourcePath) => {
            // resourcePath - path to css file

            // Don't handle `img.png` urls
            if (url.includes('/static')) {
              return false
            }

            return true
          },
        }
      }
    }
  }
}
