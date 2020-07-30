module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@/assets/scss/main.scss';
        `
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')

    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Topic voting app'
        return args
      })
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true
    },
    i18n: {
      locale: 'pl',
      fallbackLocale: 'pl',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  pwa: {
    name: 'Meet Magento PL - Vote',
    themeColor: '#fe5f15',
    msTileColor: '#FFFFFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    manifestOptions: {
      background_color: '#FFFFFF'
    }
  }
}
