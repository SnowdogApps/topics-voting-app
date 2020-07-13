<template>
  <section class="col-xs-12 col-md-8 login-section">
      <transition name="fade">
        <div
          v-if="isLoggedIn"
          class="col-xs-12"
        >
          Hi
          <span class="bold">
            {{ user.displayName || user.email }}
          </span>!
          <br>
          You can vote on proposed topics or add your own proposition.
          <br>
          <v-button
            :class="'button--link'"
            @btn-event="logout"
          >
            {{ $t('login.logout') }}
          </v-button>
        </div>
      </transition>
      <transition name="fade">
        <div
          v-if="isEmailVerification"
          class="col-xs-12"
        >
          <p>
            Hi
            <span class="bold">
              {{ user.displayName || user.email }}
            </span>!
            <br>
            Your email address is not verified.
            <br>
            You should receive an email verification request, check your email box.
          </p>
          <p>
            If you didn't receive an email:
            <v-button
              :class="'button--link'"
              @btn-event="resendEmailVerification"
            >
              Resend email verification request
            </v-button>
          </p>
          <v-button
            :class="'button--link'"
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
import { mapGetters } from 'vuex'
import { checkSocialLogin } from '../helpers'
import VButton from '@/components/Button.vue'
import AuthUser from '@/components/AuthUser.vue'

export default {
  components: {
    AuthUser,
    VButton
  },
  computed: {
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
.login-section {
  position: relative;
}
</style>
