<template>
  <transition name="fade">
    <a

      v-if="visible"
      href="#"
      class="back-to-top"
      @click="scroll"
    >
      Back to top
    </a>
  </transition>
</template>

<script>
export default {
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
  background-color: $preset;
  color: white;
  text-decoration: none;
  padding: $spacer--xs;
  z-index: 1;
}
</style>
