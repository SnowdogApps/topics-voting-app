<template>
  <div
    v-if="topic"
    :id="id"
    class="topic-item"
  >
    <div class="col-md-1"></div>
    <edit-topic
      v-if="adminView && editMode"
      :id="id"
      @cancel-edit="editMode = false"
      @saved-edit="editMode = false"
    />
    <div v-else class="topic-item__content col-md-10">
      <v-popover
        v-if="topic.authorRole === 'observer'"
        placement="top"
        container="body"
      >
        <button
          class="topic-item__badge topic-item__badge--available"
          :disabled="adminView"
        >
          {{ $t('topic.to-grab')}}
        </button>
        <template v-slot:popover>
          <div v-html="$t('topic.to-grab-info', {email: 'contact@meetmagento.pl'})">
          </div>
        </template>
      </v-popover>
      <div
        v-if="topic.authorRole === 'speaker' && isAdmin"
        class="topic-item__badge"
      >
        {{ $t('topic.c4p')}}
      </div>
      <h1
        v-if="!listItem"
        class="topic-item__title justified"
      >
        {{ topic.title }}
      </h1>
      <h3
        v-else
        class="topic-item__title justified">{{ topic.title }}
      </h3>
      <div class="justified">
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
        class="topic-item__description justified"
      ></div>
      <div
        v-if="topic.targetGroup"
        class="topic-item__target-group"
      >
        <span class="bold">{{ $t('add-form.target-group-field-placeholder') }}</span>:
        <span>{{ topic.targetGroup }}</span>
      </div>
      <social-share
        v-if="!adminView"
        :url="shareUrl"
        :title="topic.title"
        :description="topic.description"
      />
      <topic-item-details
        v-if="isAdmin && adminView"
        :id="id">
      </topic-item-details>
      <div class="topic-item__btn-section"
        v-if="isAdmin && adminView">
        <v-button
          v-if="editable"
          class="button--with-margin"
          @btn-event="editTopic"
        >
          {{ $t('global.edit') }}
        </v-button>
        <v-button
          v-if="!topic.approved && !topic.rejected"
          class="
            button--with-margin
            button--secondary
          "
          @btn-event="rejectTopic"
        >
          {{ $t("topic.reject-button") }}
        </v-button>
        <v-button
          v-if="!topic.approved && !topic.rejected"
          class="button--with-margin"
          @btn-event="approveTopic"
        >
          {{ $t('topic.approve-button') }}
        </v-button>
      </div>
    </div>
    <div class="topic-item__vote">
      <div class="topic-item__vote-number">
        <h4>
          {{ $t('topic.votes') }}
        </h4>
        {{ topic.votes || 0 }}
      </div>
      <v-button
        v-if="!adminView"
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
import { VTooltip, VPopover } from 'v-tooltip'
import VButton from '@/components/Button.vue'
import SocialShare from '@/components/SocialShare.vue'
import markdown from '@/mixins/markdown.js'

Vue.directive('tooltip', VTooltip)

export default {
  components: {
    VButton,
    VPopover,
    SocialShare,
    LikeIcon: () => import('@/assets/icons/like.svg'),
    TopicItemDetails: () => import('@/components/TopicItemDetails.vue'),
    EditTopic: () => import('@/components/EditTopic.vue')
  },
  props: {
    id: {
      type: String,
      required: true
    },
    listItem: {
      type: Boolean,
      default: false
    },
    editable: {
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
    },
    adminView () {
      return this.$router.currentRoute.path.includes('admin-dashboard')
    }
  },
  data () {
    return {
      shareUrl: `${process.env.VUE_APP_URL}topic/${this.id}`,
      editMode: false
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
    },
    rejectTopic () {
      const topicId = this.id
      this.$store.dispatch('rejectTopic', topicId)
    },
    editTopic () {
      this.editMode = true
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

  @include mq($screen-sm-min) {
    flex-direction: row;
    justify-content: space-between;
  }

  .topic-list--rejected & {
    background-color: $gray-lighter;
  }

  &__content {
    position: relative;
    flex-grow: 1;
    padding: $spacer--m $spacer--m;
    word-break: break-word;
    box-shadow: $box-shadow;
    text-align: left;
  }

  &__badge {
    position: absolute;
    top: $spacer--s;
    right: 0;
    width: auto;
    display: block;
    background-color: $preset;
    padding: 4px $spacer--xs;
    margin-bottom: $spacer--xs;
    color: $gray-dark;
    font-weight: $font-weight-bold;

    &--available {
      background-color: $secondary;
      color: $white;
      border: none;
      font-size: $font-size-base;
      font-family: $font-family-base;
      position: unset;
      &:hover,
      &:focus,
      &:active {
        cursor: pointer;
        box-shadow: $box-shadow;
      }
    }
  }

  &__title {
    margin: $spacer--l 0 $spacer--s 0;
  }

  &__target-group {
    margin-top: $spacer--s;
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

  &__btn-section {
    display: flex;
    justify-content: center;
    margin: $spacer--s 0;
  }

  &__vote {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: flex-start;
    @include mq($max-screen: $screen-sm-min) {
      flex-flow: row;
      justify-content: flex-end;
    }
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
    border: 2px solid $preset;
    background-color: $white;

    .button__icon {
      fill: $preset;
      width: 32px;
      height: 32px;
    }

    &--voted {
      background-color: $preset;
      border-color: $preset;

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
