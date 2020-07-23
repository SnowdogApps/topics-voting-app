<template>
  <nav
    id="nav"
    class="navbar between-xs"
  >
    <div class="navbar__link-container">
      <router-link
          to="/"
          class="link"
        >Home</router-link>
        <router-link
          v-if="isAdmin"
          to="/admin-dashboard"
          class="link"
        >{{ $t('admin.admin-dashboard') }}</router-link>
        <router-link
          v-if="isLoggedIn"
          :to="{
            name: 'user',
            params: {
              id: this.$store.state.user.id
            }
          }"
          class="link"
        >{{ $t('user.user-dashboard') }}</router-link>
    </div>
    <lang-switcher />
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import LangSwitcher from '@/components/LangSwitcher.vue'

export default {
  components: {
    LangSwitcher
  },
  computed: {
    ...mapGetters({
      isAdmin: 'isAdmin',
      isLoggedIn: 'isLoggedIn'
    })
  }
}
</script>

<style lang="scss">
.navbar {
  display: flex;
  flex-wrap: nowrap;
  position: fixed;
  top: 0;
  padding: 0;
  width: 100%;
  text-transform: uppercase;
  font-size: 13px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06);
  background-color: $white;
  z-index: 100;

  &__link-container {
    padding: $spacer--s;
  }
}
</style>
