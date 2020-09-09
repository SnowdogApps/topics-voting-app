<template>
  <div id="app">
    <page-header />
    <scroll-top/>
    <transition name="fade">
      <newsletter-sticky
        v-if="showNewsletterSticky"
        :show-newsletter-modal.sync="showNewsletterModal"
        @close="closeNewsletterSticky = true"
      />
    </transition>
    <transition name="fade">
      <newsletter-modal
        v-if="showNewsletterModal"
        @close="showNewsletterModal = false"
      />
    </transition>
    <main class="container">
      <router-view/>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import notification from '@/mixins/notification.js'
import fb from '@/mixins/facebook.js'
import { auth } from '@/db'
import ScrollTop from '@/components/ScrollTop.vue'
import PageHeader from '@/components/PageHeader.vue'
import NewsletterSticky from '@/components/NewsletterSticky.vue'
import NewsletterModal from '@/components/NewsletterModal.vue'

export default {
  components: {
    ScrollTop,
    PageHeader,
    NewsletterSticky,
    NewsletterModal
  },
  data () {
    return {
      showNewsletterModal: false,
      closeNewsletterSticky: false
    }
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
      topics: 'getApprovedTopics',
      isSubscribed: 'isSubscribed'
    }),
    showNewsletterSticky () {
      return this.isLoggedIn && !this.isSubscribed && !this.closeNewsletterSticky
    },
    metaTitle () {
      return this.$t('meta.title')
    },
    metaDescription () {
      return this.$t('meta.description')
    }
  },
  metaInfo () {
    const locale = this.$i18n.locale
    return {
      title: this.metaTitle,
      htmlAttrs: {
        lang: locale
      },
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.metaDescription
        },
        {
          vmid: 'og:title',
          name: 'og:title',
          content: this.metaTitle
        },
        {
          vmid: 'og:description',
          name: 'og:description',
          content: this.metaTitle
        },
        {
          vmid: 'og:image',
          name: 'og:image',
          content: `${location.origin}/img/meet-magento-meta-${locale}.png`
        },
        {
          vmid: 'twitter:title',
          name: 'twitter:title',
          content: this.metaTitle
        },
        {
          vmid: 'twitter:description',
          name: 'twitter:description',
          content: this.metaTitle
        },
        {
          vmid: 'twitter:image',
          name: 'twitter:image',
          content: `${location.origin}/img/meet-magento-meta-${locale}.png`
        }
      ]
    }
  },
  methods: {
    setLanguage () {
      if (typeof localStorage === 'undefined') {
        return
      }
      const lang = localStorage.getItem('lang')
      if (lang) {
        this.$i18n.locale = lang
      } else {
        localStorage.setItem('lang', this.$i18n.locale)
      }
      auth.lang = this.$i18n.locale
    }
  }
}
</script>

<style lang="scss">
.container {
  margin-top: $navbar-height;
  @include mq($screen-md-min) {
    margin-top: $spacer--xl;
  }
}
</style>
