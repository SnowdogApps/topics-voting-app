<template>
  <div class="row center-xs">
    <div class="col-xs-12">
      <topic-item :id="id" />
    </div>
    <user-state class="col-xs-12" />
    <div class="col-xs-12">
      <router-link
        to="/"
        class="button button--secondary"
      >
        {{ $t('topic.see-all') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import UserState from '@/components/UserState.vue'
import TopicItem from '@/components/TopicItem.vue'

export default {
  components: {
    UserState,
    TopicItem
  },
  props: {
    id: {
      type: String,
      require: true
    }
  }
}
</script>
