<template>
  <div id="app">
    <header class="row between-xs">
      <navbar/>
    </header>
    <main class="container">
      <router-view/>
    </main>
    <scroll-top/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import notification from '@/mixins/notification.js'
import fb from '@/mixins/facebook.js'
import ScrollTop from '@/components/ScrollTop.vue'
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    ScrollTop,
    Navbar
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
  margin-top: 80px;
}
</style>
