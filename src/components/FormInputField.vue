<template>
  <div :class="['input', { 'input--error': validator && validator.$error }]">
    <label
      class="label"
      :for="id"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      v-model.trim="data"
      class="input__field"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @input="validator && validator.$touch()"
      :autocomplete="autocomplete"
    >
    <slot name="validation">
      <div
        v-if="validator && !validator.required"
        class="error"
      >
        {{ $t('form.required-field') }}
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    validator: {
      type: Object,
      default: null
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: String,
      default: '150'
    },
    type: {
      type: String,
      default: 'text'
    },
    autocomplete: {
      type: String,
      required: true
    }
  },
  computed: {
    data: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
