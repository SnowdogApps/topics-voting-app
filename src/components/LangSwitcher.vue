<template>
  <div class="dropdown">
    <button
      :class="['dropdown__button', { 'dropdown__button--active': show }]"
      type="button"
      @click="toggle"
      :aria-label="$t('lang-switcher.lang-switcher-label')"
    >
      {{ $i18n.locale.toUpperCase() }}
    </button>

    <transition name="fade">
      <div v-show="show" class="dropdown__content">
        <div
          v-for="lang in langs"
          :key="lang"
          class="dropdown__link"
          @click="saveLang(lang)"
        >
          {{ lang }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      langs: ['en', 'pl'],
      show: false
    }
  },
  methods: {
    saveLang (lang) {
      this.hide()
      this.$i18n.locale = lang
      if (typeof localStorage === 'undefined') {
        return
      }
      localStorage.setItem('lang', lang)
    },
    toggle () {
      this.show = !this.show
    },
    hide () {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import './src/assets/scss/dropdown';
</style>
