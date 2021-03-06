<template>
  <section
    id="user-section"
    class="
      col-xs-12
      col-md-8
    "
  >
      <transition name="fade">
        <div
          v-if="isLoggedIn"
          class="
            auth-section
            col-xs-12
            col-lg-8
            m-auto
          "
        >
          <h2
            class="
              uppercase
              heading--h3
              auth-section__heading-name
            "
          >
            {{ $t('user.hi', { name: user.displayName || user.email}) }}
          </h2>
          <template v-if="!voteFinished">
            <p>{{ $t('user.welcome-msg') }}</p>
            <a class="button" href="#add-topic">
                {{ $t('user.add-your-topic') }}
            </a>
            <br>
          </template>
          <v-button
            class="button--link"
            @btn-event="logout"
          >
            {{ $t('login.logout') }}
          </v-button>
        </div>
      </transition>
      <transition name="fade">
        <div
          v-if="isEmailVerification"
          class="
            col-xs-12
            col-md-6
            m-auto
          "
        >
          <h2 class="uppercase heading--h3">
            {{ $t('user.hi', { name: user.displayName || user.email}) }}
          </h2>
          <p>
            {{ $t('user.email-not-verified') }}
            <br>
            {{ $t('user.verification-email-info') }}
          </p>
          <p>
            {{ $t('user.email-not-received') }}
            <v-button
              class="button--link"
              @btn-event="resendEmailVerification"
            >
              {{ $t('user.resend-email') }}
            </v-button>
          </p>
          <v-button
            class="button--link"
            @btn-event="logout"
          >
            {{ $t('login.logout') }}
          </v-button>
        </div>
      </transition>
      <transition name="fade">
        <v-button
          v-if="!user && !showLogin"
          @btn-event="showLogin = true"
        >
          {{ $t('login.login-create-button') }}
        </v-button>
      </transition>
      <transition name="fade">
        <auth-user
          v-if="!user && showLogin"
          @hide-auth="showLogin = false"
        />
      </transition>
  </section>
</template>
<script>
import { auth } from './../db'
import { mapState, mapGetters } from 'vuex'
import { checkSocialLogin } from '../helpers'
import VButton from '@/components/Button.vue'
import AuthUser from '@/components/AuthUser.vue'

export default {
  components: {
    AuthUser,
    VButton
  },
  computed: {
    ...mapState({
      voteFinished: state => state.voteFinished
    }),
    ...mapGetters([
      'isLoggedIn',
      'user'
    ]),
    isEmailVerification () {
      return this.user && !this.user.emailVerified && !checkSocialLogin(this.user.provider)
    }
  },
  data () {
    return {
      showLogin: false
    }
  },
  methods: {
    logout () {
      auth
        .signOut()
        .then(() => {
          this.$store.commit('notification/push', {
            message: this.$t('login.logout-successful'),
            title: this.$t('global.success'),
            type: 'success'
          }, { root: true })
        }).catch((err) => {
          this.$store.commit('notification/push', {
            message: err.message,
            title: this.$t('global.error'),
            type: 'error'
          }, { root: true })
        })
    },
    resendEmailVerification () {
      this.$store.dispatch('sendEmailVerification')
    }
  }
}
</script>
<style lang="scss" scoped>
@import './src/assets/scss/auth-section';
</style>
