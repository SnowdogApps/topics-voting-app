<template>
  <nav
    class="
      navbar
      navbar-expand-lg
      flex
      center-xs
    "
    :class="{ 'top-nav-collapse': isNavCollapsed }"
  >
    <div class="nav-container">
      <div class="navbar-header">
        <a href="https://meetmagento.pl/"
          class="navbar-brand"
        >
          <logo-svg />
        </a>
        <toggle
          @click="toggleMenu"
          :show="showMenu"
        ></toggle>
      </div>
      <transition name="slide">
        <div
          id="main-navbar"
          class="navbar-collapse"
          :class="{'active': showMenu}"
        >
          <div class="nav-container">
              <ul class="navbar-nav">
                <li
                  v-for="route in routes"
                  :key="route.title"
                  class="nav-item"
                  @click="redirect"
                >
                  <router-link
                    v-if="route.show && route.to"
                    :to="route.to"
                    class="nav-link"
                    exact-active-class="active"
                  >
                    {{ route.title }}
                  </router-link>
                </li>
              </ul>
              <ul class="navbar-nav navbar-nav--right">
                <li
                  class="nav-item"
                  @click="showMenu = false"
                >
                  <a
                    href="https://meetmagento.pl/#pricing"
                    class="nav-link"
                    target="_blank"
                  >
                    {{ $t('home.buy-ticket') }}
                  </a>
                </li>
                <li
                  class="nav-item"
                  @click="showMenu = false"
                >
                  <a
                    href="https://meetmagento.pl/#faq"
                    class="nav-link"
                    target="_blank"
                  >
                    {{ $t('home.faq-link') }}
                  </a>
                </li>
                <li
                  class="nav-item"
                  @click="showMenu = false"
                >
                  <a
                    href="https://meetmagento.pl/#contactSection"
                    class="nav-link"
                    target="_blank"
                  >
                    {{ $t('home.contact-link') }}
                  </a>
                </li>
                <li>
                  <lang-switcher class="nav-link" />
                </li>
              </ul>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import LangSwitcher from '@/components/LangSwitcher.vue'
import Toggle from '@/components/Toggle.vue'

export default {
  components: {
    LangSwitcher,
    Toggle,
    LogoSvg: () => import('@/assets/icons/logo.svg')
  },
  data () {
    return {
      isNavCollapsed: false,
      showMenu: false
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'isAdmin',
      isLoggedIn: 'isLoggedIn',
      user: 'user'
    }),
    routes () {
      return [
        {
          title: this.$t('home.home-link'),
          to: '/',
          show: true
        },
        {
          title: this.$t('user.user-dashboard'),
          to: (this.user) ? `/user/${this.user.id}` : null,
          show: this.isLoggedIn
        },
        {
          title: this.$t('admin.admin-dashboard'),
          to: '/admin',
          show: this.isAdmin
        }
      ]
    }
  },
  mounted () {
    this.navCollapsing()
    window.addEventListener('scroll', this.navCollapsing, { passive: true })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.navCollapsing, { passive: true })
  },
  methods: {
    navCollapsing () {
      const element = document.scrollingElement || document.srcElement
      if (element.scrollTop > 200) {
        this.isNavCollapsed = true
      } else {
        this.isNavCollapsed = false
      }
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    },
    trackEvent () {
      this.$gtag('event', 'buy-ticket-button-click', {
        event_label: 'Header'
      })
    },
    redirect () {
      this.showMenu = false
      window.scrollTo(0, 0)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './src/assets/scss/navbar';
</style>
