<template>
  <header class="header">
    <navbar />
    <div class="header__top-section">
      <img class="header__img" src="@/assets/images/header.png" />
      <h1 class="header__text">
        <span class="text">
          {{ $t("home.home-title") }}
        </span>
        <span class="text text--light">
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
  }
}
</script>

<style lang="scss">
.header__top-section {
  text-align: center;
  position: relative;
  @include mq($max-screen: $screen-md-max) {
    @include visually-hidden();
  }
}

.header__img {
  object-fit: cover;
  height: 100vh;
  max-height: 748px;
  width: 100%;
}

.header__text {
  max-width: 80%;
  position: absolute;
  top: 50%;
  left: 42%;
  transform: translate(-42%, -50%);
  text-align: left;
  display: flex;
  flex-direction: column;
  @include mq($min-screen: $screen-md-min) {
    min-width: 960px;
  }

  .text {
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
</style>
