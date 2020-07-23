<template>
  <div class="row center-xs">
    <div class="col-xs-12 col-md-8">
      <p class="top-description__title bold">
        {{ $t('home.home-top-description-title') }}
      </p>
      <p v-html="$t('home.home-top-description')"></p>
      <p v-if="!isLoggedIn">
        {{ $t('home.login-info') }}
      </p>
    </div>
    <user-state class="col-xs-12" />
    <topic-list
      :topics="topics"
      :title="$t('home.list-items-title')"
      class="col-xs-12"
    />
    <add-topic
      v-if="isLoggedIn"
      class="col-xs-12"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    })
  }
}
</script>

<style lang="scss">
.top-description__title {
  font-size: $font-size-extra-large;
  margin: $spacer--s 0 $spacer--l;
  @include mq($min-screen: $screen-sm-min) {
    font-size: 32px;
    line-height: 42px;
  }
}
</style>
