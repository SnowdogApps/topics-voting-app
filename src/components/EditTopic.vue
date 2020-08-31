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
        <div :class="['radio', { 'radio--error': $v.c4p.$error }]">
          <fieldset class="fieldset" aria-labelledby="radio-legend">
            <legend id="radio-legend" class="fieldset__legend">
              {{ $t('add-form.c4p-radio-legend') }}
            </legend>
            <div class="radio__handler">
              <input
                type="radio"
                id="c4p-false"
                class="radio__field"
                v-model="c4p"
                value="false"
              >
              <label for="c4p-false" class="radio__label">
                <span class="radio__text" :class="{'selected': $v.c4p.$model === 'false'}">
                  {{ $t('add-form.radio-c4p-false') }}
                </span>
              </label>
            </div>
            <div class="radio__handler">
              <input
                type="radio"
                id="c4p-true"
                class="radio__field"
                v-model="c4p"
                value="true"
              >
              <label for="c4p-true" class="radio__label">
                <span class="radio__text" :class="{'selected': $v.c4p.$model === 'true'}">
                  {{ $t('add-form.radio-c4p-true') }}
                </span>
              </label>
            </div>
          </fieldset>
          <div
            v-if="!$v.c4p.required"
            class="error"
          >
            {{ $t('form.required-field') }}
          </div>
        </div>
        <template v-if="this.c4p === 'true'">

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
          <p>
            <span class="bold">
              {{ $t('topic.speaker-id') }}
            </span>
            {{ topic.speakerId }}
          </p>
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
        </template>
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
import { required, email, requiredIf } from 'vuelidate/lib/validators'
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
    ...mapState({
      allUsers: 'allUsers'
    }),
    topic () {
      return this.$store.getters.topicById(this.id)
    },
    topicSpeaker () {
      return this.allUsers.find(user => user.id === this.topic.speakerId)
    },
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
      speaker: '',
      speakerEmail: '',
      company: '',
      position: '',
      contactEmail: '',
      language: 'pl',
      languages: ['pl', 'en'],
      c4p: 'false',
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
      c4p: {
        required: true
      },
      speaker: {
        required: requiredIf(() => {
          return this.c4p === 'true'
        })
      },
      speakerEmail: {
        required: requiredIf(() => {
          return this.c4p === 'true'
        })
      },
      company: {
        required: requiredIf(() => {
          return this.c4p === 'true'
        })
      },
      position: {
        required: requiredIf(() => {
          return this.c4p === 'true'
        })
      },
      contactEmail: {
        required: requiredIf(() => {
          return this.c4p === 'true'
        }),
        email
      }
    }
  },
  created () {
    if (this.topic) {
      this.title = this.topic.title || ''
      this.description = this.topic.description || ''
      this.targetGroup = this.topic.targetGroup || ''
      this.c4p = this.topic.c4p || false
      this.speaker = this.topic.speaker || ''
      this.speakerEmail = this.topic.speakerEmail
    }
    if (this.topicSpeaker) {
      this.company = this.topicSpeaker.company || ''
      this.position = this.topicSpeaker.position || ''
      this.contactEmail = this.topicSpeaker.contactEmail || this.topicSpeaker.email || ''
    }
  },
  methods: {
    checkAssignedTopic (userKey) {
      const userData = this.allUsers.find(user => user.id === userKey)
      for (var i in userData.topics) {
        if (userData.topics[i].topicId === this.topic['.key']) {
          return i
        }
      }
    },
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
        const dataUpdated = {
          title: this.title,
          description: this.description,
          targetGroup: this.targetGroup,
          lang: this.language,
          c4p: this.c4p
        }
        if (this.c4p === 'true') {
          const speakerDetails = {
            company: this.company,
            position: this.position,
            contactEmail: this.contactEmail
          }
          if (this.allUsers) {
            // if speaker doesn't changed
            if (this.speakerEmail && (this.topic.speakerEmail === this.speakerEmail)) {
              // update speaker data
              this.updateUserData(speakerDetails, this.topic.speakerId)
              // update topic data
              this.updateTopicData(dataUpdated)
            } else if (this.topic.speakerEmail !== this.speakerEmail) { // if speaker changed or speaker assigned
              // check if provided email is assign to any registered user
              const newSpeaker = this.allUsers.find(item => item.email === this.speakerEmail)
              if (newSpeaker) {
                // update new speaker data
                const newTopicKey = this.checkAssignedTopic(newSpeaker.id)
                // if topic is already assign to user
                if (newTopicKey) {
                  const newSpeakerData = {
                    userId: newSpeaker.id,
                    topicKey: newTopicKey,
                    data: {
                      speaker: 'yes'
                    }
                  }
                  this.$store.dispatch('updateUserTopic', newSpeakerData)
                    .catch((err) => {
                      console.log(err)
                    })
                } else {
                  // assign topic to user
                  const newSpeakerData = {
                    userId: newSpeaker.id,
                    topicData: {
                      author: (newSpeaker.id === this.topic.authorId) ? 'yes' : 'no',
                      speaker: 'yes',
                      topicId: this.topic['.key']
                    }
                  }
                  this.$store.dispatch('assignTopicToUser', newSpeakerData)
                }
                // update old speaker exist, update his topic data
                if (this.topic.speakerId) {
                  const oldSpeakerTopicKey = this.checkAssignedTopic(this.topic.speakerId)
                  this.updateOldSpeakerData(this.topicSpeaker.id, oldSpeakerTopicKey)
                }
                // update topic data
                dataUpdated.speaker = this.speaker
                dataUpdated.speakerEmail = this.speakerEmail
                dataUpdated.speakerId = newSpeaker.id
                dataUpdated.authorRole = (newSpeaker.id === this.topic.authorId) ? 'speaker' : 'observer'
                this.updateTopicData(dataUpdated)
                // update user data
                this.updateUserData(speakerDetails, newSpeaker.id)
              } else {
                // display error msg if user with provided email doesn't exist in db
                this.$store.commit('notification/push', {
                  message: this.$t('add-form.user-not-exist'),
                  title: 'Error',
                  type: 'error'
                }, { root: true })
                this.loading = false
                this.speakerEmail = ''
              }
            }
          } else {
            // display error msg if users list is not found
            this.$store.commit('notification/push', {
              message: this.$t('add-form.users-not-found'),
              title: 'Error',
              type: 'error'
            }, { root: true })
            this.resetFormData()
          }
        } else {
          // if user was, update old speaker info
          if (this.topic.speakerId) {
            const oldSpeakerTopicKey = this.checkAssignedTopic(this.topic.speakerId)
            this.updateOldSpeakerData(this.topic.speakerId, oldSpeakerTopicKey)
          }

          // clear speaker info if topic != c4p
          dataUpdated.speaker = ''
          dataUpdated.speakerEmail = ''
          dataUpdated.speakerId = ''
          // update topic data
          this.updateTopicData(dataUpdated)
        }
      }
    },
    updateUserData (data, userId) {
      this.$store.dispatch('updateUserData', {
        userId: userId,
        userData: data
      }).catch((err) => {
        console.log(err)
      })
    },
    updateTopicData (data) {
      this.$store.dispatch('editTopic', {
        topicId: this.topic['.key'],
        topicData: data
      }).then(() => {
        this.resetFormData()
      })
    },
    updateOldSpeakerData (oldSepakerId, userTopicKey) {
      const oldSpeakerData = {
        userId: oldSepakerId,
        topicKey: userTopicKey,
        data: {
          speaker: 'no'
        }
      }
      this.$store.dispatch('updateUserTopic', oldSpeakerData)
        .catch((err) => {
          console.log(err)
        })
    },
    resetFormData () {
      this.$v.$reset()
      this.loading = false
      this.submitStatus = 'OK'
      this.$emit('saved-edit')
    },
    cancel () {
      this.$emit('cancel-edit')
    }
  }
}
</script>
