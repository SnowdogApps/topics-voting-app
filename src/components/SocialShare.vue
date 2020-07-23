<template>
  <div class="social-share">
    <span class="bold">Share:</span>
    <ul class="share-list">
      <li
        v-for="network in networks"
        :key="network.network"
        class="share-list__item"
      >
        <ShareNetwork
          :network="network.network"
          :url="url"
          :title="title"
          :description="description"
          :twitterUser="sharing.twitter"
          :hashtags="sharing.hashtags"
          class="share-list__item-link"
        >
          <component :is="network.icon"></component>
        </ShareNetwork>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {
    FbIcon: () => import('@/assets/icons/fb.svg'),
    TwitterIcon: () => import('@/assets/icons/twitter.svg'),
    LinkedInIcon: () => import('@/assets/icons/linkedin.svg')
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
.social-share {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  line-height: initial;
}
.share-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: $spacer--s;

  &__item {
    list-style-type: none;
  }

  &__item-link {
    width: 42px;
    height: 42px;
    padding-right: $spacer--xs;
    cursor: pointer;
  }
}
</style>
