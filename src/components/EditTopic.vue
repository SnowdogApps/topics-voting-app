<template>
  <div class="form-section col-xs-12">
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
          autocomplete="off"
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
          autocomplete="off"
        />
        <form-input-field
          v-model="speaker"
          :validator="$v.speaker"
          id="speaker"
          :label="$t('add-form.speaker-name-field-label')"
          :placeholder="$t('add-form.speaker-name-field-label')"
          maxlength="150"
          autocomplete="off"
        />
        <form-input-field
          v-model="speakerEmail"
          :validator="$v.speakerEmail"
          id="speakerEmail"
          :label="$t('add-form.speaker-email-field-label')"
          :placeholder="$t('add-form.speaker-email-field-placeholder')"
          maxlength="150"
          autocomplete="off"
        />
        <div>
          <span class="bold">
            {{ $t('topic.speaker-id') }}
          </span>
          {{ topic.speakerId }}
        </div>
        <div class="form-section__action">
          <v-button
            class="button--secondary button--with-margin"
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
      <h3 class="heading--h4">
        {{ $t('add-form.description-preview') }}
      </h3>
      <div v-html="compiledMarkdown(description)"></div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { mapState } from 'vuex'
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
    },
    ...mapState({
      allUsers: 'allUsers'
    })
  },
  data () {
    return {
      title: '',
      description: '',
      targetGroup: '',
      speaker: '',
      speakerEmail: '',
      loading: false,
      submitStatus: null
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
      targetGroup: {
        required
      },
      speaker: {
        required: false
      },
      speakerEmail: {
        required: false
      }
    }
  },
  created () {
    this.$store.dispatch('bindAllUsers')
    if (this.topic) {
      this.title = this.topic.title || ''
      this.description = this.topic.description || ''
      this.targetGroup = this.topic.targetGroup || ''
      this.speaker = this.topic.speaker || ''
      this.speakerEmail = this.topic.speakerEmail
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
        if (!this.topic.speakerEmail && this.$v.speakerEmail.$dirty) {
          const dataUpdated = {
            title: this.title,
            description: this.description,
            targetGroup: this.targetGroup
          }
          // check is there is a user with provided email
          if (this.allUsers) {
            const newSpeaker = this.allUsers.find(item => item.email === this.speakerEmail)
            if (newSpeaker) {
              const data = {
                authorId: this.topic.authorId,
                newSpeakerId: newSpeaker['.key'],
                newSpeakerEmail: this.speakerEmail,
                topicId: this.topic['.key']
              }
              this.$store.dispatch('updateSpeaker', data)
              dataUpdated.speaker = this.speaker
              dataUpdated.speakerEmail = this.speakerEmail
              dataUpdated.speakerId = newSpeaker['.key']
              this.$store.dispatch('editTopic', {
                topicId: this.topic['.key'],
                topicData: dataUpdated
              })
                .then(() => {
                  this.$v.$reset()
                  this.loading = false
                  this.submitStatus = 'OK'
                  this.$emit('saved-edit')
                })
            } else {
              console.log('there is no user with such email')
            }
          }
          // if not - create account
        } else if (this.topic.speakerEmail && this.$v.speakerEmail.$dirty) {
          console.log('you are changing speaker info')
          // check if spekerEmail has changed
          const isEmailChanged = this.topic.speakerEmail === this.speakerEmail
          console.log('isEmailChanged', isEmailChanged)
          // check is there is a user with provided email
          // if not - create account
        }
      }
    },
    cancel () {
      this.$emit('cancel-edit')
    }
  }
}
</script>
