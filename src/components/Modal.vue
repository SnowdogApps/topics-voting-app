<template>
  <transition name="modal">
    <div class="modal">
      <div
        class="modal__mask"
        @click="$emit('close')"
      />
      <div
        role="document"
        tabindex="0"
        class="modal__content"
      >
        <slot />

        <button
          class="modal__close-btn"
          aria-label="Close Modal"
          @click="$emit('close')"
        >
          <close-svg class="modal__close-icon"/>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  components: {
    CloseSvg: () => import('@/assets/icons/close.svg')
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: $z-index-highest;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0;

  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: $z-index-high;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    transition: opacity 0.3s ease;
  }

  &__content {
    width: 80%;
    max-width: 600px;
    position: relative;
    z-index: $z-index-high;
    display: block;
    min-width: 320px;
    height: auto;
    padding: 24px;
    overflow: auto;
    background-color: #fff;
    border: none;
    transition: all 0.3s ease;
  }

  &__close-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    position: absolute;
    top: 1px;
    right: 1px;
    padding: 0;
    height: 48px;
    width: 48px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
      background: $orange;

      .modal__close-icon {
        fill: $white;
      }
    }
  }

  &__close-icon {
    opacity: 1;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal__content,
.modal-leave-active .modal__content {
  transform: scale(1.1);
}
</style>
