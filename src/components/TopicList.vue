<template>
  <section>
    <h2 class="heading--underline">
      {{ title }}
    </h2>
      <div
        v-if="adminView"
        class="filters"
      >
        <button
          class="button filters__button"
          :class="{ 'button--secondary': !votesAsc }"
          @click="votesAsc = !votesAsc, votesDesc = false"
        >
          Votes Ascending
          <arrow-svg/>
        </button>
        <button
          class="button"
          :class="{ 'button--secondary': !votesDesc }"
          @click="votesDesc = !votesDesc, votesAsc = false"
        >
          Votes Descending
          <arrow-svg/>
        </button>
      </div>
      <ul
        v-if="sortedTopics.length"
        class="topics-list"
      >
        <li
          v-for="(item) in sortedTopics"
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
    },
    sortedTopics () {
      return this.sortTopics() || this.topics
    }
  },
  data () {
    return {
      votesAsc: false,
      votesDesc: false
    }
  },
  methods: {
    sortTopics () {
      if (this.votesAsc) {
        return this.topics.slice().sort((a, b) => {
          return a.votes - b.votes
        })
      } else if (this.votesDesc) {
        return this.topics.slice().sort((a, b) => {
          return b.votes - a.votes
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.topics-list {
  list-style: none;
  padding: 0;
}

.filters {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;

  &__button {
    margin-right: $spacer--m;
  }
}
</style>
