<template>
  <div v-if="topic" :id="id" class="topic-item">
    <edit-topic
      v-if="adminView && editMode"
      :id="id"
      @cancel-edit="editMode = false"
      @saved-edit="editMode = false"
    />
    <div v-else class="topic-item__content">
      <div class="topic-item__topic">
        <div class="topic-item__info">
          <div class="topic-item__header">
            <h2
              v-if="!listItem"
              class="
                topic-item__title
                justified
                uppercase
              "
            >
              {{ topic.title }}
            </h2>
            <h3 v-else class="topic-item__title justified uppercase">
              {{ topic.title }}
            </h3>
            <div class="topic-item__header-top">
              <PlIcon
                v-if="topic.lang === 'pl'"
                class="topic-item__lang-icon"
              />
              <EnIcon
                v-else
                class="topic-item__lang-icon"
              />
              <button
                v-if="topic.authorRole === 'observer'"
                type="button"
                class="topic-item__badge"
                v-tooltip="{
                  content: $t('topic.to-grab-info', {email: 'contact@meetmagento.pl'}),
                  trigger: 'focus click',
                  classes: 'tooltip--light'
                }"
              >
                {{ $t("topic.to-grab") }}
              </button>
              <div
                v-if="topic.authorRole === 'speaker' && isAdmin"
                class="
                  topic-item__badge
                  topic-item__badge--c4p
                "
              >
                {{ $t("topic.c4p") }}
              </div>
            </div>
          </div>
          <div class="topic-item__link justified">
            <router-link
              :to="{
                name: 'topic',
                params: {
                  id: id
                }
              }"
              >{{ topic.title }}</router-link
            >
          </div>
          <div
            v-if="topic.description"
            v-html="compiledMarkdown(topic.description)"
            class="topic-item__description justified"
          ></div>
          <div v-if="topic.targetGroup" class="topic-item__target-group">
            <span class="bold">{{
              $t("add-form.target-group-field-placeholder")
            }}</span
            >:
            <span>{{ topic.targetGroup }}</span>
          </div>
          <div v-if="userView">
            <span class="bold">
              {{ $t('topic.status') }}
            </span>
            {{ topic.approved ? $t('topic.approved') : $t('topic.not-approved') }}
          </div>
        </div>
        <div class="topic-item__vote">
          <v-button
            v-if="!adminView"
            :class="[
              'topic-item__upvote',
              {
                'topic-item__upvote--voted': isVoted,
                'topic-item__upvote--disabled': voteDisabled
              }
            ]"
            @btn-event="
              isVoted ? downvote(id, topic.votes) : upvote(id, topic.votes)
            "
            v-tooltip="{
              content: tooltipText,
              trigger: 'hover focus click'
            }"
            :aria-label="tooltipText"
          >
            <span class="button__icon">
              <LikeIcon />
            </span>
          </v-button>
          <div class="topic-item__vote-number">
            <h4>
              {{ $t("topic.votes") }}
            </h4>
            {{ topic.votes || 0 }}
          </div>
        </div>
      </div>
      <div class="topic-item__addons">
        <social-share
          v-if="!adminView"
          :url="shareUrl"
          :title="topic.title"
          :description="topic.description"
        />
        <topic-item-details v-if="isAdmin && adminView" :id="id">
        </topic-item-details>
        <div class="topic-item__btn-section" v-if="isAdmin && adminView">
          <v-button
            v-if="editable"
            class="button--secondary button--with-margin"
            @btn-event="editTopic"
          >
            {{ $t("global.edit") }}
          </v-button>
          <v-button
            v-if="!topic.approved && !topic.rejected"
            class="
              button--with-margin
              button--tertiary
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
            {{ $t("topic.approve-button") }}
          </v-button>
          <v-button
            v-if="topic.rejected"
            class="button--secondary button--with-margin"
            @btn-event="addToApproval"
          >
            {{ $t('topic.add-to-approval-button') }}
          </v-button>
        </div>
      </div>
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
    LikeIcon: () => import('@/assets/icons/like.svg'),
    TopicItemDetails: () => import('@/components/TopicItemDetails.vue'),
    EditTopic: () => import('@/components/EditTopic.vue'),
    PlIcon: () => import('@/assets/icons/pl.svg'),
    EnIcon: () => import('@/assets/icons/en.svg')
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
      return this.$router.currentRoute.path.includes('admin-dashboard') && this.isAdmin
    },
    userView () {
      return this.$router.currentRoute.path.includes('user')
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
    addToApproval () {
      const topicId = this.id
      this.$store.dispatch('addToApproval', topicId)
    },
    editTopic () {
      this.editMode = true
    }
  }
}
</script>
<style lang="scss" scoped>
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
    padding: 0px;
    word-break: break-word;
    box-shadow: $box-shadow;
    text-align: left;
  }

  &__info {
    flex-basis: 100%;
  }

  &__header {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
  }

  &__header-top {
    display: flex;
    margin-bottom: $spacer--s;
    justify-content: space-between;
    @include mq($screen-md-min) {
      justify-content: flex-start;
    }
  }

  &__lang-icon {
    display: block;
    border: 1px solid $gray-lighter;
    width: 42px;
    height: 32px;
    margin-right: $spacer--s;
  }

  &__badge {
    display: block;
    border: none;
    background-color: $white;
    padding: 4px $spacer--s;
    text-align: center;
    color: $font-color-base;
    font-weight: $font-weight-extra-bold;
    font-size: $font-size-small;
    line-height: 25px;
    box-shadow: $box-shadow;
    border-left: solid 2px $success;
    transition: $transition-base;
    cursor: pointer;

    &:hover,
    &.focus-visible {
      background-color: $preset;
    }

    &--c4p {
      border-left: solid 2px $preset;
    }
    &.has-tooltip {
      cursor: pointer;
    }
  }

  &__topic {
    padding: $spacer--m;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    @include mq($max-screen: $screen-md-max) {
      flex-direction: column;
    }
  }

  &__addons {
    padding: $spacer--m;
    border-top: $border-base;
  }

  &__title {
    margin: 0 0 $spacer--s 0;
    max-width: 900px;
    @include mq($max-screen: $screen-lg-max) {
      max-width: 700px;
    }
  }

  &__link {
    a {
      color: $preset;
    }
  }

  &__target-group {
    margin-top: $spacer--s;
  }

  &__btn-section {
    display: flex;
    justify-content: center;
    margin: $spacer--s 0 0;
  }

  &__vote {
    display: flex;
    flex-flow: row-reverse;
    align-items: center;
    justify-content: flex-start;
    margin: $spacer--s 0 0 0;

    @include mq($screen-md-min) {
      margin: 50px 0 0 $spacer--m;
      flex-flow: column;
    }
  }

  &__vote-info {
    padding: 0 $spacer--s;
  }

  &__vote-number {
    text-align: center;
    word-break: keep-all;
    & > h4 {
      margin: 0;
    }
  }

  &__upvote {
    padding: 0 $spacer--xs;
    min-width: 56px;
    height: 56px;
    border: 2px solid $preset;
    background-color: $white;

    @include mq($max-screen: $screen-md-max) {
      margin: 0 0 0 $spacer--m;
    }

    .button__icon {
      fill: $preset;
      width: 32px;
      height: 32px;
    }

    &--voted {
      background-color: $preset;
      border-color: $preset;

      .button__icon {
        fill: $blue;
      }
    }

    &--disabled {
      cursor: not-allowed;
      background-color: $gray-lighter;
      border: 0;
      .button__icon {
        fill: $blue;
      }
    }
  }
}
</style>
