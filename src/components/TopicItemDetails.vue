<template>
<div class="topic-details">
  <h4>{{ $t('topic.speaker-details') }}</h4>
  <ul class="topic-details__list">
    <li>
      <span class="bold">
        {{ $t('topic.speaker') }}
      </span>
      {{ topic.speaker }}
    </li>
    <li>
      <span class="bold">
        {{ $t('topic.speaker-id') }}
      </span>
      {{ topic.speakerId }}
    </li>
    <li>
      <span class="bold">
        {{ $t('topic.speaker-email') }}
      </span>
      {{ topic.speakerEmail }}
    </li>
  </ul>
  <ul
    v-if="speaker"
    class="topic-details__list"
  >
    <li>
      <span class="bold">
        {{ $t('topic.speaker-company') }}
      </span>
      {{ speaker.company }}
    </li>
    <li>
      <span class="bold">
        {{ $t('topic.speaker-position') }}
      </span>
      {{ speaker.position }}
    </li>
    <li>
      <span class="bold">
        {{ $t('topic.speaker-contact-email') }}
      </span>
      {{ speaker.contactEmail }}
    </li>
  </ul>
  <h4>
    {{ $t('topic.details') }}
  </h4>
    <ul class="topic-details__list">
      <li>
        <span class="bold">
          {{ $t('topic.topic-id') }}
        </span>
        {{ topic['.key'] }}
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
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      allUsers: 'allUsers'
    }),
    topic () {
      return this.$store.getters.topicById(this.id)
    },
    speaker () {
      return this.allUsers.find(user => user.uid === this.topic.speakerId)
    }
  }
}
</script>
<style lang="scss" scoped>
.topic-details__list {
  display: block;
  margin: $spacer--s 0;
  padding: 0;
  list-style: none;
  line-height: 2;
}
</style>
