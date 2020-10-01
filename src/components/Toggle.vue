<template>
  <button
    :class="['navbar-toggle', { active: show }]"
    aria-label="Toggle navigation"
    @click="click"
  >
    <span />
    <span />
    <span />
  </button>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.navbar-toggle {
  display: none;
  position: relative;
  padding: $spacer--xs;
  z-index: $z-index-low;
  border: none;
  background-color: transparent;
  cursor: pointer;

  > span {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;
    background: $preset;
    border-radius: 3px;
    transform-origin: 4px 0px;
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;

    &:last-child {
      transform-origin: 0% 100%;
      margin-bottom: 0;
    }

    @include mq($max-screen: $screen-sm-max) {
      width: 30px;
      height: 3px;
    }
  }

  &.active {
    > span {
      opacity: 1;
      background: $preset;

      &:first-child {
        transform: rotate(45deg) translate(4px, -4px);
      }

      &:nth-child(2) {
        opacity: 0;
        transform: rotate(0deg) scale(0.2, 0.2);
      }

      &:last-child {
        opacity: 1;
        transform: rotate(-45deg) translate(3px, 5px);
      }
    }
  }

  @include mq($max-screen: $screen-md-max) {
    display: block;
  }
}
</style>
