<template>
  <div id="app">
    <page-header />
    <scroll-top/>
    <main class="container">
      <router-view/>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import notification from '@/mixins/notification.js'
import fb from '@/mixins/facebook.js'
import ScrollTop from '@/components/ScrollTop.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  components: {
    ScrollTop,
    PageHeader
  },
  created () {
    this.$store.dispatch('bindTopics')
    this.$store.dispatch('onAuthStateChanged')
    this.setLanguage()
  },
  mixins: [notification, fb],
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      isAdmin: 'isAdmin'
    })
  },
  methods: {
    setLanguage () {
      if (typeof localStorage === 'undefined') {
        return
      }
      const lang = localStorage.getItem('lang')
      if (lang) {
        this.$i18n.locale = lang
      }
    }
  }
}
</script>

<style lang="scss">
.container {
  margin-top: $spacer--xl;
}
</style>
