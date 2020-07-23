<template>
  <div class="row center-xs">
    <h1>{{ $t('user.user-dashboard') }}</h1>
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
      isLoggedIn: 'isLoggedIn'
    }),
    userTopics () {
      return this.$store.state.topics.filter(topic => {
        return topic.authorId === this.$store.state.user.id && !topic.speakerId
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
