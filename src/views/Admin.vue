<template>
  <div class="row center-xs">
    <h1 class="uppercase">
      {{ admin.content.title }}
    </h1>
    <topic-list
      :topics="topicsNotApproved"
      :title="admin.content.notApprListTitle"
      :editable="true"
      class="col-xs-12"
    />
    <topic-list
      :topics="topicsApproved"
      :title="admin.content.apprListTitle"
      :editable="true"
      class="col-xs-12"
    />
    <topic-list
      :topics="topicsRejected"
      :title="admin.content.rejectedListTitle"
      :editable="false"
      class="col-xs-12 topic-list--rejected"
    />
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import TopicList from '@/components/TopicList.vue'
export default {
  components: {
    TopicList
  },
  data () {
    return {
      admin: {}
    }
  },
  async mounted () {
    const lang = this.$i18n.locale
    try {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}entity`, {
          params: {
            name: 'admin',
            lang
          }
        }
      )
      this.admin = res.data
    } catch (err) {
      console.error(err)
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      topicsNotApproved: 'getNotApprovedTopics',
      topicsApproved: 'getApprovedTopics'
    }),
    topicsRejected () {
      return this.$store.state.topics.filter(topic => {
        return topic.rejected
      })
    },
    notApprListTitle () {
      return this.$t('admin.not-approved-list-title')
    },
    apprListTitle () {
      return this.$t('admin.approved-list-title')
    },
    rejectedListTitle () {
      return this.$t('admin.rejected-list-title')
    }
  },
  created () {
    this.$store.dispatch('bindAllUsers')
  }
}
</script>
