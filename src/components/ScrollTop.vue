<template>
  <transition name="fade">
    <a
      v-if="visible"
      href="#"
      class="
        back-to-top
        button--secondary
      "
      @click="scroll"
      :aria-label="$t('home.back-to-top')"
    >
      <arrow-svg />
    </a>
  </transition>
</template>

<script>
export default {
  components: {
    ArrowSvg: () => import('@/assets/icons/arrow.svg')
  },
  data () {
    return {
      visible: false
    }
  },
  created () {
    window.addEventListener('scroll', () => {
      this.visible = window.scrollY > 400
    })
  },
  methods: {
    scroll (e) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss">
.back-to-top {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: $spacer--s;
  text-decoration: none;
  padding: $spacer--xs;
  z-index: 1;
  text-decoration: none;
  line-height: initial;
  box-shadow: 0 0 4px rgba(0,0,0,.14),
    0 4px 8px rgba(0,0,0,.28)
}
</style>
