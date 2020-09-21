<template>
  <div class="newsletter-form">
    <loader v-if="loading"/>
    <div
      v-else-if="message"
      class="heading text-center"
    >
      {{ this.submitStatus === 'OK' ? $t('newsletter.success-msg') : $t('newsletter.error-msg') }}
    </div>
    <form
      v-else
      class="newsletter-form__form"
      @submit.prevent="submit"
    >
      <form-input-field
        v-model="formData.firstname"
        :validator="$v.formData.firstname"
        id="firstname"
        :label="$t('login.first-name')"
        :placeholder="$t('login.first-name')"
        autocomplete="username"
      />

      <form-input-field
        v-model.trim="formData.email"
        :validator="$v.formData.email"
        id="email"
        label="Email"
        placeholder="Email"
        type="email"
        autocomplete="email"
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

      <v-button
        class="button--fluid"
        type="submit"
        :disabled="$v.$invalid"
      >
        {{ $t('newsletter.button') }}
      </v-button>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import errorMsgProvider from '@/mixins/errorMsgProvider.js'
import { mapGetters } from 'vuex'
import axios from 'axios'
import Loader from '@/components/Loader.vue'
import FormInputField from '@/components/FormInputField.vue'
import VButton from '@/components/Button.vue'

export default {
  components: {
    Loader,
    FormInputField,
    VButton
  },
  mixins: [
    validationMixin,
    errorMsgProvider
  ],
  data () {
    return {
      loading: false,
      message: null,
      lang: '',
      submitStatus: null,
      formData: {
        firstname: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  validations () {
    return {
      formData: {
        firstname: {
          required
        },
        email: {
          required,
          email
        }
      }
    }
  },
  mounted () {
    this.lang = this.$i18n.locale
    this.formData.firstname = this.user.displayName
    this.formData.email = this.user.email
  },
  methods: {
    async submit () {
      this.$v.$touch()

      try {
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'
        } else {
          this.loading = true
          this.submitStatus = 'PENDING'

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
          }).then(() => {
            this.$v.$reset()
            this.loading = false
            this.message = true
            this.submitStatus = 'OK'
            this.$store.commit('SET_NEWSLETTER')
          })
        }
      } catch (err) {
        console.error(err)
        this.loading = false
        this.message = true
        this.submitStatus = 'ERROR'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.newsletter-form {
  display: flex;
  justify-content: stretch;
  align-items: center;
  height: 320px;

  &__form {
    width: 100%;
  }
}
</style>
