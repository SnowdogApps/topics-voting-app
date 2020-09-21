<template>
  <div>
    <form v-on:submit.prevent>
      <form-input-field
        v-if="!login"
        v-model="formData.firstname"
        :validator="$v.formData.firstname"
        id="firstname"
        :label="$t('login.first-name')"
        :placeholder="$t('login.first-name')"
        autocomplete="username"
      />
      <form-input-field
        v-if="!login"
        v-model="formData.lastname"
        :validator="$v.formData.lastname"
        id="lastname"
        :label="$t('login.last-name')"
        :placeholder="$t('login.last-name')"
        autocomplete="family-name"
      />
      <form-input-field
        v-if="!isLinkingProviderPassword"
        v-model.trim="formData.email"
        :validator="$v.formData.email"
        id="email"
        label="Email"
        placeholder="Email"
        type="email"
        :autocomplete="isLinkingProviderPassword ? 'off' : 'email'"
      >
        <template #validation>
           <div
            v-if="!$v.formData.email.required"
            class="error"
          >
            {{ $t('form.required-field') }}
          </div>
          <div
            v-if="!$v.formData.email.email"
            class="error"
          >
            {{ $t('form.invalid-email-address')}}
          </div>
        </template>
      </form-input-field>
      <form-input-field
        v-if="!resetPassword"
        v-model="formData.password"
        :validator="$v.formData.password"
        id="password"
        :label="$t('login.password')"
        :placeholder="$t('login.password')"
        type="password"
        :autocomplete="login ? 'current-password' : 'new-password'"
      />
      <p
        v-if="resetPassword"
        class="login__action"
      >
        {{ $t('login.reset-password-info') }}
      </p>
      <form-checkbox-field
        v-if="!login"
        v-model="formData.newsletter"
        id="newsletter"
        :label="$t('login.subscribe-to-newsletter')"
      />
      <div class="form-section__action">
        <v-button
          v-if="login && resetPassword"
          type="submit"
          :disabled="$v.$invalid"
          @btn-event="sendPasswordResetEmail"
        >
          {{ $t('login.send-reset-password-email') }}
        </v-button>
        <v-button
          v-else-if="login && !resetPassword"
          type="submit"
          :disabled="$v.$invalid"
          @btn-event="signIn"
        >
          {{ $t('login.log-in') }}
        </v-button>
        <v-button
          v-else-if="!isLinkingProviderPassword"
          type="submit"
          :disabled="$v.$invalid"
          @btn-event="createUser"
        >
          {{ $t('login.create-account') }}
        </v-button>
      </div>
    </form>
    <template v-if="!isLinkingProviderPassword">
      <p
        v-if="login && !resetPassword"
        class="login__action"
      >
        {{ $t('login.forgotten-password') }}
        <v-button
          class="button--link button--small"
          @btn-event="resetPassword = true"
        >
          {{ $t('login.reset-password') }}
        </v-button>
      </p>
      <p class="login__action">
        {{ login
          ? $t('login.no-account')
          : $t('login.account-exists')
        }}
        <v-button
          class="button--link button--small"
          @btn-event="switchLogin"
        >
          {{ login
            ? $t('login.create-account-here')
            : $t('login.log-in')
          }}
        </v-button>
      </p>
      <v-button
        class="button--login button--link"
        @btn-event="backToSocial"
      >
        {{ $t('login.login-with-social-media') }}
      </v-button>
    </template>
  </div>
</template>
<script>
import { auth } from './../db'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import linkAccount from '@/mixins/linkAccount.js'
import errorMsgProvider from '@/mixins/errorMsgProvider.js'
import axios from 'axios'
import VButton from '@/components/Button.vue'
import FormInputField from '@/components/FormInputField.vue'
import FormCheckboxField from '@/components/FormCheckboxField.vue'

export default {
  components: {
    VButton,
    FormInputField,
    FormCheckboxField
  },
  computed: {
    ...mapGetters({
      linkProvider: 'linkProvider',
      linkCreds: 'linkCreds',
      linkEmail: 'linkEmail'
    }),
    isLinkingProviderPassword () {
      return this.linkProvider === 'password'
    }
  },
  mixins: [
    validationMixin,
    linkAccount,
    errorMsgProvider
  ],
  data () {
    return {
      formData: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        newsletter: false
      },
      login: true,
      submitStatus: null,
      resetPassword: false,
      lang: ''
    }
  },
  mounted () {
    this.lang = this.$i18n.locale
  },
  validations () {
    if (this.resetPassword) {
      return {
        formData: {
          email: {
            required,
            email
          }
        }
      }
    } else if (this.isLinkingProviderPassword) {
      return {
        formData: {
          password: {
            required
          }
        }
      }
    } else if (this.login && !this.isLinkingProviderPassword) {
      return {
        formData: {
          email: {
            required,
            email
          },
          password: {
            required
          }
        }
      }
    } else {
      return {
        formData: {
          firstname: {
            required
          },
          lastname: {
            required
          },
          email: {
            required,
            email
          },
          password: {
            required
          }
        }
      }
    }
  },
  methods: {
    signIn () {
      // if sing in is connected with linking account set email value
      if (this.isLinkingProviderPassword) {
        this.formData.email = this.linkEmail
      }
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.submitStatus = 'PENDING'
        auth.signInWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        ).then((result) => {
          const user = result.user
          if (this.isLinkingProviderPassword) {
            this.linkAccountCreds(user, this.linkCreds)
          }
        }).catch((err) => {
          if (err.code === 'auth/account-exists-with-different-credential') {
            this.setLinkingAccountData(err)
          } else if (err.code === 'auth/wrong-password') {
            const creds = {
              email: this.formData.email,
              pass: this.formData.password
            }
            this.setLinkingAccountData(err, creds).then((result) => {
              if (this.linkProvider && this.linkProvider !== 'password') {
                this.$parent.emailPass = false
              } else if (!result) {
                this.$store.commit('notification/push', {
                  message: this.getErrMessage(err.code),
                  title: 'Error',
                  type: 'error'
                }, { root: true })
              }
            })
          } else {
            this.$store.commit('notification/push', {
              message: this.getErrMessage(err.code),
              title: 'Error',
              type: 'error'
            }, { root: true })
          }
        })
      }
    },
    async subscribe () {
      try {
        await axios({
          method: 'post',
          url: '/subscribe',
          data: {
            name: this.formData.firstname,
            email: this.formData.email,
            lang: this.lang
          }
        })

        this.$store.dispatch('addSubscription', {
          lang: this.lang
        })
      } catch (err) {
        console.error(err)
        this.$store.commit('notification/push', {
          message: this.$t('newsletter.error-msg'),
          title: this.$t('global.error'),
          type: 'error'
        }, { root: true })
      }
    },
    createUser () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.submitStatus = 'PENDING'
        const self = this
        auth.createUserWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        ).then((result) => {
          result.user.updateProfile({
            displayName: `${this.formData.firstname} ${this.formData.lastname}`
          }).then(() => {
            const user = auth.currentUser

            if (this.formData.newsletter) {
              this.subscribe()
            }

            // if is a new user, save data in db
            self.$store.dispatch('assignUserData', user)
            self.$store.commit('SET_AUTH_USER', { user })
          })
        }).catch((err) => {
          console.log(err)
          this.$store.commit('notification/push', {
            message: this.getErrMessage(err.code),
            title: this.$t('global.error'),
            type: 'error'
          }, { root: true })
        })
      }
    },
    backToSocial () {
      this.$emit('update:emailPass', false)
    },
    switchLogin () {
      this.login = !this.login
      this.resetPassword = false
    },
    sendPasswordResetEmail () {
      this.$v.$touch()
      if (this.$v.invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.submitStatus = 'PENDING'
        const state = {
          url: `${window.location.href}?reset=true`
        }
        auth.sendPasswordResetEmail(this.formData.email, state).then((result) => {
          this.$store.commit('notification/push', {
            message: this.$t('login.reset-password-email-sent'),
            title: this.$t('global.success'),
            type: 'success'
          }, { root: true })
          this.backToSocial()
        }).catch((err) => {
          this.$store.commit('notification/push', {
            message: this.getErrMessage(err.code),
            title: this.$t('global.error'),
            type: 'error'
          }, { root: true })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login__action {
  margin: $spacer--xs;
  font-size: $font-size-extra-small;
}
</style>
