<template>
<div class="topic-item__details">
   <h4>
      {{ $t('topic.details') }}
    </h4>
    <ul class="topic-item__list">
      <li>
        <span class="bold">
          {{ $t('topic.speaker') }}
        </span>
        {{ topic.speaker }}
      </li>
      <li>
        <span class="bold">
          {{ $t('topic.author-id') }}
        </span>
        {{ topic.authorId }}
      </li>
      <li>
        <span class="bold">
          {{ $t('topic.author-name') }}
        </span>
        {{ topic.authorName }}
      </li>
      <li>
        <span class="bold">
          {{ $t('topic.author-email') }}
        </span>
        {{ topic.authorEmail }}
      </li>
      <li>
        <span class="bold">
          {{ $t('topic.created') }}
        </span>
        {{ topic.createDate }}
      </li>
      <li>
        <span class="bold">
          {{ $t('topic.status') }}
        </span>
        {{ topic.approved ? $t('topic.approved') : $t('topic.not-approved') }}
      </li>
    </ul>
</div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    topic () {
      return this.$store.getters.topicById(this.id)
    }
  }
}
</script>
