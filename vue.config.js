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
        args[0].title = 'Meet Magento Poland - Głosuj na prelegentów'
        args[0].description = 'Zgłaszaj własne pomysły, głosuj na prezentacje i twórz agendę razem z nami.'
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
    name: 'Meet Magento Poland - Głosuj na prelegentów',
    themeColor: '#fe5f15',
    msTileColor: '#FFFFFF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    manifestOptions: {
      background_color: '#FFFFFF'
    }
  }
}
