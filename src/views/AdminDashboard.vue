<template>
  <div class="row center-xs">
    <h1>{{ $t('admin.admin-dashboard') }}</h1>
    <topic-list
      :topics="topicsNotApproved"
      :title="notApprListTitle"
      :editable="true"
      class="col-xs-12"
    />
    <topic-list
      :topics="topicsApproved"
      :title="apprListTitle"
      :editable="true"
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
      topicsNotApproved: 'getNotApprovedTopics',
      topicsApproved: 'getApprovedTopics'
    }),
    notApprListTitle () {
      return this.$t('admin.not-approved-list-title')
    },
    apprListTitle () {
      return this.$t('admin.approved-list-title')
    }
  }
}
</script>
