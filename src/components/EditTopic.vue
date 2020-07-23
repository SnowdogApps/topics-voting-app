<template>
  <div class="form-section col-xs-12 col-md-10">
    <div class="form-section__form">
      <h3 class="uppercase">
        {{ $t('add-form.edit-topic') }}
      </h3>
      <loader v-if="loading" class="loader--overlay" />
      <form v-if="submitStatus !== 'OK'" @submit.prevent="saveTopic">
        <form-input-field
          v-model="title"
          :validator="$v.title"
          id="title"
          :label="$t('add-form.title-field-label')"
          :placeholder="$t('add-form.title-field-label')"
          maxlength="150"
        />
        <div :class="['input', { 'input--error': $v.description.$error }]">
          <label for="description" class="form__label">
            {{ $t("add-form.description-field-label") }}
          </label>
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
              <div v-if="!$v.description.required" class="error">
                {{ $t("form.required-field") }}
              </div>
              <div v-if="!$v.description.maxLength" class="error">
                {{ $t("add-form.description-field-tips") }}
              </div>
            </div>
            <span class="col-xs form-section__field-tip">
              {{ charactersLeft }}
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
        />
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
                  {{ $t('add-form.author-observer')}}
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
                  {{ $t('add-form.author-speaker')}}
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
        </div>
        <div class="form-section__action">
          <v-button
            class="button--cancel button--with-margin"
            @btn-event="cancel"
          >
            {{ $t('global.cancel') }}
          </v-button>
          <v-button
            class="button--with-margin"
            type="submit"
          >
            {{ $t('global.save') }}
          </v-button>
        </div>
      </form>
    </div>
    <div v-if="description" class="form-section__preview">
      <h4>
        {{ $t('add-form.description-preview') }}
      </h4>
      <div v-html="compiledMarkdown(description)"></div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import debounce from 'lodash.debounce'
import markdown from '@/mixins/markdown.js'
import VButton from '@/components/Button.vue'
import Loader from '@/components/Loader.vue'
import FormInputField from '@/components/FormInputField.vue'

export default {
  components: {
    VButton,
    Loader,
    FormInputField
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    topic () {
      return this.$store.getters.topicById(this.id)
    },
    charactersLeft () {
      const char = this.description.length
      const limit = 700
      return `${(limit - char)} / ${limit}`
    }
  },
  data () {
    return {
      title: '',
      description: '',
      targetGroup: '',
      authorRole: '',
      loading: false,
      submitStatus: null
    }
  },
  mixins: [
    validationMixin,
    markdown
  ],
  validations: {
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
    }
  },
  methods: {
    debounceInput () {
      debounce(function (e) {
        this.input = e.target.value
      }, 300)
    },
    saveTopic () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        this.loading = true
        this.submitStatus = 'PENDING'
        this.$store.dispatch('editTopic', {
          title: this.title,
          description: this.description,
          targetGroup: this.targetGroup,
          authorRole: this.authorRole,
          id: this.id
        }).then(() => {
          this.$v.$reset()
          this.loading = false
          this.submitStatus = 'OK'
          this.$emit('saved-edit')
        })
      }
    },
    cancel () {
      this.$emit('cancel-edit')
    }
  },
  created () {
    if (this.topic) {
      this.title = this.topic.title || ''
      this.description = this.topic.description || ''
      this.targetGroup = this.topic.targetGroup || ''
      this.authorRole = this.topic.authorRole || ''
    }
  }
}
</script>
