<template>
  <ul class="share-list">
    <li
      v-for="network in networks"
      :key="network.network"
      class="share-list__item"
    >
      <ShareNetwork
        :network="network.network"
        :style="{backgroundColor: network.color}"
        :url="url"
        :title="title"
        :description="description"
        :twitterUser="sharing.twitter"
        :hashtags="sharing.hashtags"
        class="share-list__item-link"
      >
        <span class="share-list__item-icon">
          <component :is="network.icon"></component>
        </span>
        <span class="share-list__item-text">
          {{ $t('share.share') }} {{ network.name }}
        </span>
      </ShareNetwork>
    </li>
  </ul>
</template>

<script>
export default {
  components: {
    FbIcon: () => import('@/assets/icons/fb-i.svg'),
    TwitterIcon: () => import('@/assets/icons/twitter-i.svg'),
    LinkedInIcon: () => import('@/assets/icons/linkedin-i.svg')
  },
  props: {
    url: {
      type: String,
      require: true
    },
    description: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      sharing: {
        hashtags: '#mmpl2020',
        twitter: '@MeetMagentoPL'
      },
      networks: [
        {
          network: 'facebook',
          name: 'Facebook',
          icon: 'FbIcon',
          color: '#1877f2'
        },
        {
          network: 'linkedin',
          name: 'LinkedIn',
          icon: 'LinkedInIcon',
          color: '#007bb5'
        },
        {
          network: 'twitter',
          name: 'Twitter',
          icon: 'TwitterIcon',
          color: '#1da1f2'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.share-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $spacer--s;
  margin-top: $spacer--m;
  border-top: $border-base;
  @include mq($screen-sm-min) {
    flex-direction: row;
  }

  &__item {
    display: block;
    width: 210px;
    list-style-type: none;
  }

  &__item-link {
    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: row;
    flex: none;
    padding: 4px $spacer--xs;
    margin: 0 0 $spacer--s 0;
    border-radius: 3px;
    color: $white;
    background-color: $gray-darker;
    overflow: hidden;
    cursor: pointer;
    @include mq($screen-sm-min) {
      margin: 0 $spacer--s 0 0;
    }
  }

  &__item-icon {
    display: block;
    width: 20px;
    height: 20px;
    transition: $transition-base;
  }

  &__item-text {
    flex: 1 1 auto;
    padding-left: 10px;
    font-size: $font-size-extra-small;
    font-weight: 500;
  }
}
</style>
