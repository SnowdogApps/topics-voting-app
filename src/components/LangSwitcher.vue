<template>
  <div class="lang-switcher">
    <div class="lang-switcher__select select">
      <select
        class="select__field"
        v-model="$i18n.locale"
        @change="saveLang"
      >
        <option
          v-for="(lang, i) in langs"
          :key="`Lang${i}`"
          :value="lang"
        >{{ lang }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return { langs: ['en', 'pl'] }
  },
  methods: {
    saveLang () {
      if (typeof localStorage === 'undefined') {
        return
      }
      const currentLang = this.$i18n.locale
      localStorage.setItem('lang', currentLang)
    }
  }
}
</script>
<style lang="scss" scoped>
.lang-switcher {
  display: flex;
  align-items: center;
  margin-right: 16px;

  &__select {
    margin: 0 0 0 auto;
  }
}
.select {
  position: relative;
  width: 72px;

  &:after {
    content: '';
    top: 45%;
    right: 10px;
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid $gray-light;
  }
  &__field {
    height: 48px;
    min-width: 72px;
    padding: $spacer--xs;
    border: $border-base;
    border-radius: 0;
    appearance: none;
    background: $white;
    text-align: center;
    font-family: $font-family-base;
    line-height: $line-height;
    font-size: $font-size-small;
    transition: $transition-base;
    cursor: pointer;

    &:disabled {
      background-color: $gray-lighter;
      cursor: not-allowed;
    }
  }
}
</style>
