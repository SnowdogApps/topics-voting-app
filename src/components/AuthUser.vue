<template>
  <section class="form-section m-xl">
    <h2>
      <template v-if="!emailPass && !linkProvider">
        {{ $t('login.choose-login-method') }}
      </template>
      <template v-else-if="emailPass && !linkProvider">
        {{ $t('login.login-email-password') }}
      </template>
    </h2>
    <i18n v-if="linkProvider" path="login.account-already-linked-to-email" tag="p">
      <template #provider>
        <span class="bold">{{ linkCreds.providerId }}</span>
      </template>
      <template #email>
        <span class="bold">{{ linkEmail }}</span>
      </template>
      <template #link>
        <span class="bold">
          {{
            linkProvider === 'password'
              ? $t('login.password-link')
              : linkProvider
          }}
        </span>
      </template>
    </i18n>
    <social-buttons v-if="!emailPass" />
    <v-button
      class="button--login"
      v-if="!emailPass && !linkProvider"
      @btn-event="emailPass = !emailPass"
    >
      {{ $t('login.sign-in-email-password') }}
    </v-button>
    <email-auth
      v-if="emailPass || linkProvider === 'password'"
      :emailPass.sync="emailPass"
    />
    <v-button
      class="button--login button--link"
      @btn-event="$emit('hide-auth')"
    >
      {{ $t('login.hide-login-section') }}
    </v-button>
  </section>
</template>

<script>
import EmailAuth from '@/components/EmailAuth.vue'
import SocialButtons from '@/components/SocialButtons.vue'
import VButton from '@/components/Button.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    EmailAuth,
    SocialButtons,
    VButton
  },
  computed: {
    ...mapGetters({
      linkProvider: 'linkProvider',
      linkCreds: 'linkCreds',
      linkEmail: 'linkEmail'
    })
  },
  data () {
    return {
      emailPass: false
    }
  }
}
</script>
