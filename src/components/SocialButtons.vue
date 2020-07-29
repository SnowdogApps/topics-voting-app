<template>
  <div>
    <v-button
      v-if="!linkProvider || linkProvider === 'facebook.com'"
      :class="fb.btnClass"
      @btn-event="singInWithProvider('facebook.com')"
    >
      <span class="button__icon">
        <FbIcon />
      </span>
      {{ fb.label }}
    </v-button>
    <v-button
    v-if="!linkProvider || linkProvider === 'google.com'"
      :class="google.btnClass"
      @btn-event="singInWithProvider('google.com')"
    >
      <span class="button__icon">
        <GoogleIcon />
      </span>
      {{ google.label }}
    </v-button>
    <v-button
      v-if="!linkProvider || linkProvider === 'github.com'"
      :class="github.btnClass"
      @btn-event="singInWithProvider('github.com')"
    >
      <span class="button__icon">
        <GithubIcon />
      </span>
      {{ github.label }}
    </v-button>
    <v-button
      v-if="!linkProvider || linkProvider === 'twitter.com'"
      :class="twitter.btnClass"
      @btn-event="singInWithProvider('twitter.com')"
    >
      <span class="button__icon">
        <TwitterIcon />
      </span>
      {{ twitter.label }}
    </v-button>
  </div>
</template>
<script>
import linkAccount from '@/mixins/linkAccount.js'
import errorMsgProvider from '@/mixins/errorMsgProvider.js'
import { auth } from '@/db.js'
import { mapGetters } from 'vuex'
import { getProvider } from '@/helpers.js'
import VButton from '@/components/Button.vue'

export default {
  components: {
    VButton,
    FbIcon: () => import('@/assets/icons/fb-i.svg'),
    GithubIcon: () => import('@/assets/icons/github-i.svg'),
    GoogleIcon: () => import('@/assets/icons/google-i.svg'),
    TwitterIcon: () => import('@/assets/icons/twitter-i.svg')
  },
  mixins: [linkAccount, errorMsgProvider],
  computed: {
    ...mapGetters({
      user: 'user',
      linkProvider: 'linkProvider',
      linkCreds: 'linkCreds',
      linkPass: 'linkPass'
    }),
    fb () {
      return {
        btnClass: 'button--login button--facebook',
        label: this.$t('login.sign-in-with', { social: 'Facebook' })
      }
    },
    google () {
      return {
        btnClass: 'button--login button--google',
        label: this.$t('login.sign-in-with', { social: 'Google' })
      }
    },
    github () {
      return {
        btnClass: 'button--login button--github',
        label: this.$t('login.sign-in-with', { social: 'Github' })
      }
    },
    twitter () {
      return {
        btnClass: 'button--login button--twitter',
        label: this.$t('login.sign-in-with', { social: 'Twitter' })
      }
    }
  },
  methods: {
    async singInWithProvider (provider) {
      try {
        await auth.signInWithPopup(getProvider(provider)).then((result) => {
          const user = result.user
          // if is a new user
          if (result.additionalUserInfo.isNewUser) {
            this.$store.dispatch('assignUserData', user)
          }
          // if registered with another provider and stored creds
          if (this.linkProvider && this.linkCreds) {
            this.linkAccountCreds(user, this.linkCreds)
          } else if (this.linkProvider && this.linkPass) {
            this.createEmailPassWithCreds(user, this.linkPass)
          }
        })
      } catch (err) {
        if (err.code === 'auth/account-exists-with-different-credential') {
          this.setLinkingAccountData(err).then((result) => {
            if (!result) {
              this.$store.commit('notification/push', {
                message: this.getErrMessage(err.code),
                title: this.$t('global.info'),
                type: 'info'
              }, { root: true })
            }
          })
        } else {
          this.$store.commit('notification/push', {
            message: this.getErrMessage(err.code),
            title: this.$t('global.error'),
            type: 'error'
          }, { root: true })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.button {
  &--facebook {
    background-color: #4267b2;
    border-color: #4267b2;
  }

  &--google {
    background-color: white;
    border-color: rgba(0, 0, 0, 0.54);
    color: rgba(0, 0, 0, 0.54);
  }

  &--github {
    background-color: #181717;
    border-color: #181717;
  }

  &--twitter {
    background-color: #1da1f2;
    border-color: #1da1f2;
  }

  &__icon {
    margin-right: $spacer--xs;
  }
}
</style>
