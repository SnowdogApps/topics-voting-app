<template>
  <div class="newsletter-form">
    <loader v-if="loading"/>
    <div
      v-else-if="message"
      class="heading text-center"
    >
      {{ message }}
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
      language: '',
      formData: {
        firstname: '',
        email: ''
      }
    }
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
    this.language = this.$i18n.locale
  },
  methods: {
    async submit () {
    }
  }
}
</script>

<style lang="scss">
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
