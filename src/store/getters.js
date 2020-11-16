import { checkSocialLogin } from '../helpers'

export default {
  user: (state) => {
    try {
      return state.user
    } catch {
      return false
    }
  },
  isLoggedIn: (state) => {
    try {
      return state.user.id !== null && (state.user.emailVerified || checkSocialLogin(state.user.provider))
    } catch {
      return false
    }
  },
  isAdmin: (state) => {
    try {
      return state.admin === true
    } catch {
      return false
    }
  },
  isSubscribed: (state) => {
    try {
      return state.newsletter === true
    } catch {
      return false
    }
  },
  topicById: (state) => (id) => {
    try {
      return state.topics.find(item => item['.key'] === id)
    } catch {
      return false
    }
  },
  getApprovedTopics: (state) => {
    try {
      if (state.topics) {
        return state.topics.filter(topic => {
          return topic.approved
        })
      }
    } catch {
      return false
    }
  },
  getNotApprovedTopics: (state) => {
    try {
      if (state.topics) {
        return state.topics.filter(topic => {
          return !topic.approved && !topic.rejected
        })
      }
    } catch {
      return false
    }
  },
  linkProvider: (state) => {
    try {
      if (state.linkAccount) {
        return state.linkAccount.provider
      }
    } catch {
      return false
    }
  },
  linkCreds: (state) => {
    try {
      if (state.linkAccount) {
        return state.linkAccount.creds
      }
    } catch {
      return false
    }
  },
  linkEmail: (state) => {
    try {
      if (state.linkAccount) {
        return state.linkAccount.email
      }
    } catch {
      return false
    }
  },
  linkPass: (state) => {
    try {
      if (state.linkAccount) {
        return state.linkAccount.password
      }
    } catch {
      return false
    }
  }
}
