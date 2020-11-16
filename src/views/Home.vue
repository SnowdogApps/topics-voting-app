<template>
  <div class="row center-xs">
    <div class="col-xs-12 col-md-8">
      <template v-if="voteFinished">
        <h2 v-html="$t('home.home-top-description-title-finished')"></h2>
        <p v-html="$t('home.home-top-description-finished')"></p>
      </template>
      <template v-else>
        <h2>
          {{ $t('home.home-top-description-title') }}
        </h2>
        <p v-html="$t('home.home-top-description')"></p>
      </template>
      <p v-if="!isLoggedIn && !voteFinished">
        {{ $t('home.login-info') }}
      </p>
    </div>
    <user-state class="col-xs-12" />
    <topic-list
      :topics="topics"
      :title="$t('home.list-items-title')"
      :emtyMessage="$t('topics.empty-list-home')"
      class="col-xs-12"
    />
    <add-topic
      v-if="isLoggedIn && !voteFinished"
      class="col-xs-12"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TopicList from '@/components/TopicList.vue'
import UserState from '@/components/UserState.vue'

export default {
  name: 'Home',
  components: {
    AddTopic: () => import('@/components/AddTopic.vue'),
    TopicList,
    UserState
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      topics: 'getApprovedTopics'
    }),
    ...mapState({
      voteFinished: state => state.voteFinished
    })
  }
}
</script>
