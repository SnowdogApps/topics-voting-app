<template>
  <div id="app">
    <header class="row between-xs">
      <nav
        id="nav"
        class="nav col-xs"
      >
        <router-link
          to="/"
          class="link"
        >Home</router-link>
        <router-link
          v-if="isAdmin"
          to="/admin-dashboard"
          class="link"
        >{{ $t('admin.admin-dashboard') }}</router-link>
      </nav>
      <lang-switcher class="col-xs" />
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
import LangSwitcher from '@/components/LangSwitcher.vue'
import ScrollTop from '@/components/ScrollTop.vue'

export default {
  components: {
    LangSwitcher,
    ScrollTop
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
.nav {
  padding: $spacer--m;
  text-align: left;

  a {
    padding: $spacer--xs 0;
    margin: 0 $spacer--m;
  }
}
</style>
