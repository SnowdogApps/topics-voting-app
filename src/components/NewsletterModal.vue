<template>
  <modal @close="$emit('close')">
    <h1
      class="
        heading
        heading--underline
        text-center
      "
    >
      {{ $t('newsletter.title') }}
    </h1>
    <div>
      <ul class="list">
        <li
          class="list__item"
        >
          <check-svg class="list__icon"/>
          <span>
            {{ $t('newsletter.benefit-1') }}
          </span>
        </li>
        <li
          class="list__item"
        >
          <check-svg class="list__icon"/>
          <span>
            {{ $t('newsletter.benefit-2') }}
          </span>
        </li>
        <li
          class="list__item"
        >
          <check-svg class="list__icon"/>
          <span>
            {{ $t('newsletter.benefit-3') }}
          </span>
        </li>
        <li
          class="list__item"
        >
          <check-svg class="list__icon"/>
          <span>
            {{ $t('newsletter.benefit-4') }}
          </span>
        </li>
      </ul>
    </div>
    <newsletter-form/>
  </modal>
</template>

<script>
import Modal from '@/components/Modal.vue'
import NewsletterForm from '@/components/NewsletterForm.vue'

export default {
  components: {
    NewsletterForm,
    Modal,
    CheckSvg: () => import('@/assets/icons/check.svg')
  }
}
</script>
