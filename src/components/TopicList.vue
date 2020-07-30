<template>
  <section>
    <h2 class="heading--underline">
      {{ title }}
    </h2>
      <ul
        v-if="topics.length"
        class="topics-list"
      >
        <li
          v-for="(item) in topics"
          :key="item['.key']"
        >
          <topic-item
            :id="item['.key']"
            :editable="editable"
            :listItem="true"
          />
        </li>
      </ul>
      <transition name="fade">
        <p v-if="topicsLoaded === 1 && topics.length === 0">
          {{ $t(emtyMessage) }}
        </p>
        <p v-if="topicsLoaded === 2 && topics.length === 0">
          {{ $t('error.error-occured') }}
        </p>
      </transition>
      <transition name="fade">
        <loader v-if="!topicsLoaded" />
      </transition>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import Loader from '@/components/Loader.vue'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    topics: {
      type: Array,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    emtyMessage: {
      type: String,
      default: 'topics.empty-list'
    }
  },
  components: {
    Loader,
    TopicItem: () => import('@/components/TopicItem.vue')
  },
  computed: {
    ...mapState({
      topicsLoaded: state => state.topicsLoaded
    }),
    adminView () {
      return this.$router.currentRoute.path.includes('admin')
    }
  }
}
</script>
<style lang="scss" scoped>
.topics-list {
  list-style: none;
  padding: 0;
}
</style>
