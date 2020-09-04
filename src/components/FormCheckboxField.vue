<template>
  <div :class="['checkbox', { 'input--error': validator && validator.$error }]">
    <input
      :id="id"
      v-model="checked"
      class="checkbox__field"
      type="checkbox"
    >
    <label
      class="checkbox__label"
      :for="id"
    >
      <div class="checkbox__icon-wrapper">
        <checked-svg class="checkbox__icon"/>
      </div>
      {{ label }}
    </label>
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
  components: {
    CheckedSvg: () => import('@/assets/icons/checked.svg')
  },
  props: {
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
    }
  },
  computed: {
    checked: {
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

<style lang="scss" scoped>
.checkbox {
  position: relative;
  display: flex;
  margin: $spacer--m 0;

  &__field {
    position: absolute;
    opacity: 0;

    &:checked + .checkbox__label {
      .checkbox__icon-wrapper {
        background-color: $orange;
        border: $orange;
      }

      .checkbox__icon {
        opacity: 1;
      }
    }
  }

  &__label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__icon-wrapper {
    margin: 0 $spacer--s 0 0;
    border: $border-base;
    width: 24px;
    height: 24px;
  }

  &__icon {
    cursor: pointer;
    opacity: 0;
    fill: $white;
  }
}
</style>
