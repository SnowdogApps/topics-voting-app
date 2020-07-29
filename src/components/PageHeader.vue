<template>
  <header
    :class="[
      'header',
      { 'header--home': isHome  }
    ]">
    <navbar />
    <div class="header__top-section">
      <img
        v-if="isHome"
        class="header__img"
        src="@/assets/images/header.png"
      />
      <h1 class="header__title">
        <span class="header__title-text">
          {{ $t("home.home-title") }}
        </span>
        <span
          class="
            header__title-text
            header__title-text--light
          "
        >
          {{ $t("home.home-subtitle") }}
        </span>
      </h1>
    </div>
  </header>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  computed: {
    isHome () {
      return this.$route.name === 'Home'
    }
  }
}
</script>

<style lang="scss">
.header {
  &--home {
    .header {
      &__title {
        margin: 100px auto;
        @include mq($screen-sm-min) {
          position: absolute;
          top: 50%;
          left: 42%;
          transform: translate(-42%, -50%);
          text-align: left;
          display: flex;
          flex-direction: column;
        }
        @include mq($min-screen: $screen-md-min) {
          min-width: 960px;
        }
      }
      &__title-text {
        @include mq($screen-sm-min) {
          font-size: 90px;
          line-height: 100px;
          color: $preset;
          text-transform: uppercase;
          font-weight: $font-weight-extra-bold;
          margin-bottom: 0;

          &--light {
            color: $white;
          }
        }
      }
    }
  }

  &__top-section {
    text-align: center;
    position: relative;
  }

  &__img {
    display: none;
    @include mq($screen-sm-min) {
      display: block;
      width: 100%;
      height: 100vh;
      max-height: 748px;
      object-fit: cover;
    }
  }

  &__title {
    max-width: 80%;
    margin: 100px auto 0;
    color: $preset;
  }
}
</style>
