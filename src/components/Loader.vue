<template>
  <div class="loader">
    <div class='loader__elem'>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '../assets/scss/animations.scss';

@mixin loaderDivMixin {
  border-radius: 50%;
  padding: 8px;
  border: 2px solid transparent;
  animation: rotate linear 3.5s infinite;
}

.loader {
  position: relative;
  width: 100%;
  &__elem {
    @include loaderDivMixin;
    position: relative;
    margin: 75px auto;
    width: 150px;
    height: 150px;
    display: block;
    overflow: hidden;
    border-top-color: $blue;
    border-bottom-color: $preset;
    div {
      @include loaderDivMixin;
      height: 100%;
      border-top-color: $blue;
      border-bottom-color: $preset;
    }
  }

  &--overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    background-color: $white;
    opacity: 0.5;
  }

}
</style>
