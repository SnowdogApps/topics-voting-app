<template>
  <section>
    <h2 class="section__heading">
      {{ $t('add-form.form-title') }}
    </h2>
    <div class="form-section m-auto col-xs-12 col-md-8">
      <loader v-if="loading" class="loader--overlay" />
      <form
        v-if="submitStatus !== 'OK'"
        @submit.prevent="addTopic"
      >
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
            {{ $t('add-form.description-field-label') }}
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
                <span class="radio__text">
                  {{ $t('add-form.radio-author-observer')}}
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
                <span class="radio__text">
                  {{ $t('add-form.radio-author-speaker')}}
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
          <div v-if="authorRole === 'speaker'">
            {{ $t('add-form.radio-speaker-info') }}
          </div>
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
          {{ $t('add-form.submit-info-1')}}
          <br>
          {{ $t('add-form.submit-info-2')}}
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
        <h3>
          {{ $t('add-form.description-preview')}}
        </h3>
        <div v-html="compiledMarkdown(description)"></div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
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
          authorRole: this.authorRole
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
<style lang="scss" scoped>
$radio-size: 24px;
$radio-dot-size: 12px;

.submit-error {
  color: $error;
}
.radio {
  position: relative;
  margin: 0 0 $spacer--s 0;

    &__handler {
        position: relative;
    }

    &__field {
        position: absolute;
        left: 0;
        height: $radio-size;
        width: $radio-size;
        opacity: 0;
        z-index: -1;

        &:checked + .radio__label {
            color: $gray-darker;
            font-weight: $font-weight-bold;

            &:before {
                border-color: $gray-darker;
            }

            &:after {
                opacity: 1;
                transform: scale(1);
            }
        }
    }

    &__label {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        height: auto;
        width: 100%;
        margin: $spacer--s 0;
        line-height: $line-height;
        font-size: $font-size-base;
        color: $font-color-base;
        cursor: pointer;

        &:before {
            content: '';
            position: relative;
            display: inline-block;
            border: 2px solid $gray-darker;
            border-radius: $radio-size;
            width: $radio-size;
            min-width: $radio-size;
            height: $radio-size;
            margin-right: $spacer--xs;
        }

        &:after {
            position: absolute;
            top: 6px;
            left: 6px;
            content: '';
            width: $radio-dot-size;
            height: $radio-dot-size;
            border-radius: $radio-dot-size;
            margin: auto;
            opacity: 0;
            transform: scale(0);
            background-color: $gray-darker;
            transition: $transition-base;
        }
    }

    &__text {
        width: calc(100% - #{$spacer--xs + $radio-size});
    }
}
</style>
