<template>
  <div
    v-if="topic"
    :id="id"
    class="topic-item"
  >
    <div class="topic-item__content">
      <div
        v-if="topic.authorRole === 'observer'"
        class="topic-item__badge topic-item__badge--available"
      >
        {{ $t('topic.to-grab')}}
      </div>
      <div
        v-if="topic.authorRole === 'speaker' && isAdmin"
        class="topic-item__badge"
      >
        {{ $t('topic.c4p')}}
      </div>
      <h1
        v-if="!listItem"
        class="topic-item__title"
      >
        {{ topic.title }}
      </h1>
      <h3
        v-else
        class="topic-item__title">{{ topic.title }}
      </h3>
      <div>
        <router-link
          :to="{
            name: 'topic',
            params: {
              id: id
            }
          }"
        >{{ topic.title }}</router-link>
      </div>
      <div
        v-if="topic.description"
        v-html="compiledMarkdown(topic.description)"
      ></div>
      <social-share
        :url="shareUrl"
        :title="topic.title"
        :description="topic.description"
      />
      <div v-if="isAdmin" class="topic-item__details">
        <h4>
          {{ $t('topic.details') }}
        </h4>
        <ul class="topic-item__list">
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
              {{ $t('topic.speaker') }}
            </span>
            {{ topic.authorRole === 'speaker' ? $t('global.yes') : $t('global.no') }}
          </li>
          <li>
            <span class="bold">
              {{ $t('topic.status') }}
            </span>
            {{ topic.approved ? $t('topic.approved') : $t('topic.not-approved') }}
            <v-button
              v-if="isAdmin && !topic.approved"
              class="topic-item__approve-btn"
              @btn-event="approveTopic"
            >
              {{ $t('topic.approve-button') }}
            </v-button>
          </li>
        </ul>
      </div>
    </div>
    <div class="topic-item__vote">
      <div class="topic-item__vote-number">
        <h4>
          {{ $t('topic.votes') }}
        </h4>
        {{ topic.votes }}
      </div>
      <v-button
        :class="[
          'topic-item__upvote',
          {
            'topic-item__upvote--voted': isVoted,
            'topic-item__upvote--disabled': voteDisabled
          }
        ]"
        @btn-event="isVoted ? downvote(id, topic.votes) : upvote(id, topic.votes)"
        v-tooltip="tooltipText"
        :aria-label="tooltipText"
      >
        <span class="button__icon">
          <LikeIcon />
        </span>
      </v-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { VTooltip } from 'v-tooltip'
import VButton from '@/components/Button.vue'
import SocialShare from '@/components/SocialShare.vue'
import markdown from '@/mixins/markdown.js'

Vue.directive('tooltip', VTooltip)

export default {
  components: {
    VButton,
    SocialShare,
    LikeIcon: () => import('@/assets/icons/like.svg')
  },
  props: {
    id: {
      type: String,
      required: true
    },
    listItem: {
      type: Boolean,
      default: false
    }
  },
  mixins: [markdown],
  computed: {
    ...mapState({
      userVotes: state => state.userVotes
    }),
    ...mapGetters({
      user: 'user',
      isLoggedIn: 'isLoggedIn',
      isAdmin: 'isAdmin'
    }),
    isVoted () {
      return this.userVotes.some(item => item[this.id])
    },
    topic () {
      return this.$store.getters.topicById(this.id)
    },
    voteDisabled () {
      return (
        !this.isLoggedIn ||
        (this.isLoggedIn && (this.user ? this.topic.authorId === this.user.id : false))
      )
    },
    tooltipText () {
      let message = ''
      if (!this.isLoggedIn) {
        message = this.$t('topic.tooltip-not-logged')
      } else if (this.topic.authorId === this.user.id) {
        message = this.$t('topic.tooltip-author')
      } else if (this.isVoted) {
        message = this.$t('topic.tooltip-voted')
      }
      return message
    }
  },
  data () {
    return {
      shareUrl: `${process.env.VUE_APP_URL}topic/${this.id}`
    }
  },
  methods: {
    upvote (id, votes) {
      if (!this.voteDisabled) {
        this.$store.dispatch('upvote', { id, votes })
      }
    },
    downvote (id, votes) {
      if (!this.voteDisabled) {
        const userVote = this.userVotes.find(item => item[id] === true)
        const itemKey = userVote['.key']
        this.$store.dispatch('downvote', { id, itemKey, votes })
      }
    },
    approveTopic () {
      const topicId = this.id
      this.$store.dispatch('approveTopic', topicId)
    }
  }
}
</script>
<style lang="scss">
@import './src/assets/scss/tooltip';

.topic-item {
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: $spacer--xl;
  border-bottom: $border-base;

  @include mq($screen-sm-min) {
    flex-direction: row;
    justify-content: space-between;
  }

  &__content {
    position: relative;
    flex-grow: 1;
    text-align: left;
    padding-top: $spacer--s;
    word-break: break-word;

    @include mq($screen-sm-min) {
      max-width: 70%;
    }
  }

  &__badge {
    position: absolute;
    top: $spacer--m;
    right: 0;
    width: auto;
    display: block;
    background-color: $orange;
    padding: 4px $spacer--xs;
    margin-bottom: $spacer--xs;
    color: $gray-dark;
    font-weight: $font-weight-bold;

    &--available {
      background-color: $success;
    }
  }

  &__title {
    margin-bottom: $spacer--s;
  }

  &__details {
    margin: $spacer--xl 0;
    padding-top: $spacer--m;
    border-top: $border-base;
  }

  &__list {
    display: block;
    margin: $spacer--s 0;
    padding: 0;
    list-style: none;
    line-height: 2;
  }

  &__approve-btn {
    margin-left: $spacer--m;
  }

  &__vote {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: flex-end;
  }

  &__vote-number {
    padding: $spacer--m;
  }

  &__vote-info {
    padding: 0 $spacer--s;
  }

  &__upvote {
    padding: 0 $spacer--xs;
    margin: $spacer--m;
    min-width: 56px;
    height: 56px;
    border: 2px solid $orange;
    background-color: $white;

    .button__icon {
      fill: $orange;
      width: 32px;
      height: 32px;
    }

    &--voted {
      background-color: $orange;
      border-color: $orange;

      .button__icon {
        fill: $black;
      }
    }

    &--disabled {
      cursor: not-allowed;
      background-color: $gray-lighter;
    }
  }
}
</style>
