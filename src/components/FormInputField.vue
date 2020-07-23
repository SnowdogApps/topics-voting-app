<template>
  <div :class="['input', { 'input--error': validator.$error }]">
    <label class="label"
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
      @input="validator.$touch()"
    >
    <div
      v-if="!validator.required"
      class="error"
    >
      {{ $t('form.required-field') }}
    </div>
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
      required: true
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
