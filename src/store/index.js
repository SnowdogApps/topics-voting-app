import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import notification from './notification'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notification
  },
  state: {
    topics: [],
    user: null,
    userVotes: [],
    allUsers: [],
    topicsLoaded: 0,
    admin: false,
    linkAccount: null,
    newsletter: false
  },
  mutations,
  actions,
  getters
})
