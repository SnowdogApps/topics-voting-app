<template>
  <div class="newsletter-sticky">
    <div class="newsletter-sticky__content">
      <v-button
        class="button--link button--inline"
        @btn-event="showNewsletterModal"
      >
        {{ $t('newsletter.button') }}
      </v-button>
      {{ $t('newsletter.call-to-action') }}
    </div>

    <button
      class="newsletter-sticky__close-btn"
      aria-label="Close Message"
      @click="$emit('close')"
    >
      <close-svg class="modal__close-icon"/>
    </button>
  </div>
</template>

<script>
import VButton from '@/components/Button.vue'

export default {
  components: {
    VButton,
    CloseSvg: () => import('@/assets/icons/close.svg')
  },
  methods: {
    showNewsletterModal () {
      this.$emit('update:showNewsletterModal', true)
    }
  }
}
</script>

<style lang="scss" scoped>
$newsletter-sticky-height: 85px;

$newsletter-sticky__close-btn-size: 48px;

$newsletter-sticky-padding: 0 calc(#{$newsletter-sticky__close-btn-size} + #{$spacer--s});

// $newsletter-sticky__close-btn-top: calc((#{$newsletter-sticky-height} - #{$newsletter-sticky__close-btn-size)} * 0.5);

.newsletter-sticky {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: $z-index-high;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $blue;
  height: $newsletter-sticky-height;
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.1);
  padding: $newsletter-sticky-padding;

  &__content {
    color: $white;
  }

  &__close-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    position: absolute;
    // top: $newsletter-sticky__close-btn-top;
    right: $spacer--xs;
    padding: 0;
    height: $newsletter-sticky__close-btn-size;
    width: $newsletter-sticky__close-btn-size;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    fill: $white;

    &:hover {
      background: $orange;
    }
  }

  &__close-icon {
    opacity: 1;
  }
}
</style>
