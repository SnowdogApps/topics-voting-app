export default {
  methods: {
    getErrMessage (code) {
      const msg = this.$t(`error.${code}`)
      return msg.startsWith('error.')
        ? this.$t('error.error-occured')
        : msg
    }
  }
}
