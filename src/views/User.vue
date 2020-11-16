<template>
  <div class="row center-xs">
    <h2 class="m-0">
      {{ $t('user.user-dashboard') }}
    </h2>
    <section class="col-xs-12">
      <p>
        <span class="bold">
          {{ $t('user.newsletter-status') }}
        </span>
        {{ isSubscribed ? $t('user.newsletter-subscribed') : $t('user.newsletter-not-subscribed') }}
      </p>
    </section>
    <topic-list
      :topics="speakerTopics"
      :title="speakerTopicsTitle"
      :editable="false"
      class="col-xs-12"
    />
    <topic-list
      :topics="userTopics"
      :title="userTopicsTitle"
      :editable="false"
      class="col-xs-12"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopicList from '@/components/TopicList.vue'
export default {
  components: {
    TopicList
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      isSubscribed: 'isSubscribed'
    }),
    userTopics () {
      return this.$store.state.topics.filter(topic => {
        return topic.authorId === this.$store.state.user.id &&
          topic.speakerId !== this.$store.state.user.id
      })
    },
    userTopicsTitle () {
      return this.$t('user.author-topics-list-title')
    },
    speakerTopics () {
      return this.$store.state.topics.filter(topic => {
        return topic.speakerId === this.$store.state.user.id
      })
    },
    speakerTopicsTitle () {
      return this.$t('user.speaker-topics-list-title')
    }
  }
}
</script>
