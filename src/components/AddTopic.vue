<template>
  <section id="add-topic">
    <div
      class="
        form-section
        m-auto
        col-xs-12
        col-md-7
      "
    >
      <h2 class="heading--underline">
        {{ $t('add-form.form-title') }}
      </h2>
      <loader v-if="loading" class="loader--overlay" />
      <form
        v-if="submitStatus !== 'OK'"
        class="form-section__form"
        @submit.prevent="addTopic"
      >
        <form-input-field
          v-model="title"
          :validator="$v.title"
          id="title"
          :label="$t('add-form.title-field-label')"
          :placeholder="$t('add-form.title-field-label')"
          maxlength="150"
          autocomplete="off"
        />
        <div :class="['input', { 'input--error': $v.description.$error }]">
          <i18n
            class="form__label"
            path="add-form.description-field-label"
            for="description"
            tag="label"
          >
            <template #markdown>
              <a
                class="link"
                href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
                target="_blank"
              >markdown</a>
            </template>
          </i18n>
          <textarea
            id="description"
            @input="debounceInput"
            v-model="$v.description.$model"
            class="input__field input__field--textarea"
            type="text"
            :placeholder="$t('add-form.description-field-placeholder')"
            maxlength="700"
          />
          <div class="row between-xs">
            <div class="errors col-xs">
              <div
                v-if="!$v.description.required"
                class="error"
              >
                {{ $t('form.required-field') }}
              </div>
              <div
                v-if="!$v.description.maxLength"
                class="error"
              >
                {{ $t('add-form.description-field-tips') }}
              </div>
            </div>
            <span class="col-xs form-section__field-tip">
              {{ charactersCount }}
            </span>
          </div>
        </div>
        <form-input-field
          v-model="targetGroup"
          :validator="$v.targetGroup"
          id="targetGroup"
          :label="$t('add-form.target-group-field-label')"
          :placeholder="$t('add-form.target-group-field-placeholder')"
          maxlength="150"
          autocomplete="off"
        />
        <div class="select">
          <label
            for="topic-language"
            class="select__label"
          >
            {{ $t('topic.language-label') }}
          </label>
          <select
            class="select__field"
            id="topic-language"
            v-model="language"
          >
            <option
              v-for="(language, i) in languages"
              :key="`language-${i}`"
              :value="language"
            >{{ language }}</option>
          </select>
        </div>
        <div :class="['radio', { 'radio--error': $v.description.$error }]">
          <fieldset class="fieldset" aria-labelledby="radio-legend">
            <legend id="radio-legend" class="fieldset__legend">
              {{ $t('add-form.activity-radio-legend') }}
            </legend>
            <div class="radio__handler">
              <input
                type="radio"
                id="observer"
                class="radio__field"
                v-model="$v.authorRole.$model"
                value="observer"
              >
              <label for="observer" class="radio__label">
                <span class="radio__text" :class="{'selected': $v.authorRole.$model === 'observer'}">
                  {{ $t('add-form.radio-author-observer') }}
                </span>
              </label>
            </div>
            <div class="radio__handler">
              <input
                type="radio"
                id="speaker"
                class="radio__field"
                v-model="authorRole"
                value="speaker"
              >
              <label for="speaker" class="radio__label">
                <span class="radio__text" :class="{'selected': $v.authorRole.$model === 'speaker'}">
                  {{ $t('add-form.radio-author-speaker') }}
                </span>
              </label>
            </div>
          </fieldset>
          <div
            v-if="!$v.authorRole.required"
            class="error"
          >
            {{ $t('form.required-field') }}
          </div>
          <template v-if="authorRole === 'speaker'">
            <div>
              {{ $t('add-form.radio-speaker-info') }}
            </div>
            <fieldset class="fieldset" aria-labelledby="speaker-additional">
              <legend class="fieldset__legend-visible">
                {{ $t('add-form.speaker-additional-title') }}
              </legend>
              <form-input-field
                v-model="company"
                :validator="$v.company"
                id="company"
                :label="$t('add-form.company-field-label')"
                :placeholder="$t('add-form.company-field-placeholder')"
                maxlength="150"
                autocomplete="organization"
              />
              <form-input-field
                v-model="position"
                :validator="$v.position"
                id="position"
                :label="$t('add-form.position-field-label')"
                :placeholder="$t('add-form.position-field-placeholder')"
                maxlength="150"
                autocomplete="organization-title"
              />
              <form-input-field
                v-model="contactEmail"
                :validator="$v.contactEmail"
                id="contactEmail"
                :label="$t('add-form.contact-email-field-label')"
                :placeholder="$t('add-form.contact-email-field-placeholder')"
                maxlength="150"
                autocomplete="email"
              >
                <template #validation>
                  <div
                    v-if="!$v.contactEmail.required"
                    class="error"
                  >
                    {{ $t('form.required-field') }}
                  </div>
                  <div
                    v-if="!$v.contactEmail.email"
                    class="error"
                  >
                    {{ $t('form.invalid-email-address')}}
                  </div>
                </template>
              </form-input-field>
            </fieldset>
          </template>
        </div>
        <div class="form-section__action">
          <v-button
            type="submit"
          >
            {{ $t('add-form.submit-button') }}
          </v-button>
        </div>
      </form>
      <div v-if="submitStatus === 'OK'">
        <p>
          {{ $t('add-form.submit-info-1') }}
          <br>
          {{ $t('add-form.submit-info-2') }}
        </p>
        <br>
        <v-button
          @btn-event="submitStatus = null"
        >
          {{ $t('add-form.more-button') }}
        </v-button>
      </div>
      <p
        v-if="submitStatus === 'ERROR'"
        class="submit-error"
      >
        {{ $t('form.form-error-msg') }}
      </p>
      <div
        v-if="description"
        class="form-section__preview"
      >
        <h3 class="heading--h4">
          {{ $t('add-form.description-preview') }}
        </h3>
        <div v-html="compiledMarkdown(description)"></div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, email, requiredIf } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import debounce from 'lodash.debounce'
import markdown from '@/mixins/markdown.js'
import Loader from '@/components/Loader.vue'
import VButton from '@/components/Button.vue'
import FormInputField from '@/components/FormInputField.vue'

export default {
  components: {
    Loader,
    VButton,
    FormInputField
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn'
    }),
    charactersCount () {
      const char = this.description.length
      const limit = 700
      return `${char} / ${limit}`
    }
  },
  data () {
    return {
      title: '',
      description: '',
      targetGroup: '',
      authorRole: '',
      company: '',
      position: '',
      contactEmail: '',
      loading: false,
      submitStatus: null,
      language: 'pl',
      languages: ['pl', 'en']
    }
  },
  mixins: [
    validationMixin,
    markdown
  ],
  validations () {
    return {
      title: {
        required
      },
      description: {
        required
      },
      authorRole: {
        required
      },
      targetGroup: {
        required
      },
      company: {
        required: requiredIf(() => {
          return this.authorRole === 'speaker'
        })
      },
      position: {
        required: requiredIf(() => {
          return this.authorRole === 'speaker'
        })
      },
      contactEmail: {
        required: requiredIf(() => {
          return this.authorRole === 'speaker'
        }),
        email
      }
    }
  },
  created () {
    if (this.$store.state.user) {
      this.contactEmail = this.$store.state.user.email
    }
  },
  methods: {
    debounceInput () {
      debounce(function (e) {
        this.input = e.target.value
      }, 300)
    },
    addTopic () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.loading = true
        this.submitStatus = 'PENDING'
        this.$store.dispatch('addTopic', {
          title: this.title,
          description: this.description,
          targetGroup: this.targetGroup,
          lang: this.language,
          authorRole: this.authorRole,
          authorId: this.$store.state.user.id,
          company: this.company,
          position: this.position,
          contactEmail: this.contactEmail
        }).then(() => {
          this.$v.$reset()
          this.loading = false
          this.title = ''
          this.description = ''
          this.targetGroup = ''
          this.authorRole = ''
          this.submitStatus = 'OK'
        })
      }
    }
  }
}
</script>

<style lang="scss">
$radio-size: 18px;
$radio-dot-size: 10px;

.submit-error {
  color: $error;
}
</style>
