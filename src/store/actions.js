import { firebaseAction } from 'vuexfire'
import { auth, topicRef, userRef } from '../db'
import { checkSocialLogin } from '../helpers'
import i18n from '../i18n'

export default {
  bindTopics: firebaseAction(({ bindFirebaseRef, commit }) => {
    return bindFirebaseRef('topics', topicRef)
      .then(() => {
        commit('LOAD_TOPICS', 1)
      })
      .catch((err) => {
        commit('LOAD_TOPICS', 2)
        commit('notification/push', {
          message: err.message,
          title: i18n.t('global.error'),
          type: 'error'
        }, { root: true })
      })
  }),
  bindUser: firebaseAction(({ bindFirebaseRef, state, commit }) => {
    return bindFirebaseRef(
      'userVotes',
      userRef.child(state.user.id).child('votes')
    ).catch((err) => {
      commit('notification/push', {
        message: err.message,
        title: i18n.t('global.error'),
        type: 'error'
      }, { root: true })
    })
  }),
  bindAllUsers: firebaseAction(({ bindFirebaseRef, state }) => {
    return bindFirebaseRef('allUsers', userRef)
      .catch((err) => {
        console.log(err)
      })
  }),
  addTopic: firebaseAction(({ state, commit, dispatch }, topic) => {
    return topicRef.push({
      title: topic.title,
      description: topic.description,
      targetGroup: topic.targetGroup,
      votes: 0,
      authorId: topic.authorId,
      authorEmail: state.user.email,
      authorName: state.user.displayName,
      authorRole: topic.authorRole,
      createDate: new Date(Date.now()).toLocaleString(),
      approved: false,
      lang: topic.lang,
      speaker: (topic.authorRole === 'speaker') ? `${state.user.displayName} / ${state.user.email}` : 'none',
      speakerId: (topic.authorRole === 'speaker') ? `${topic.authorId}` : null,
      speakerEmail: (topic.authorRole === 'speaker') ? `${state.user.email}` : null,
      c4p: (topic.authorRole === 'speaker') ? 'true' : 'false'
    }).then((result) => {
      const addedTopic = result.key
      const topicData = {
        topicId: addedTopic,
        author: (topic.authorId === state.user.id) ? 'yes' : 'no',
        speaker: (topic.authorRole === 'speaker') ? 'yes' : 'no'
      }
      dispatch('assignTopicToUser', {
        // topicData: topicId, author, speaker
        userId: state.user.id,
        topicData: topicData
      })
      if (topic.authorRole === 'speaker') {
        const userData = {
          company: topic.company,
          position: topic.position,
          contactEmail: topic.contactEmail
        }
        dispatch('updateUserData', { userId: state.user.id, userData })
      }
      commit('notification/push', {
        message: i18n.t('alert.proposition-added'),
        title: i18n.t('global.success'),
        type: 'success'
      }, { root: true })
    }).catch((err) => {
      commit('notification/push', {
        message: err.message,
        title: i18n.t('global.error'),
        type: 'error'
      }, { root: true })
    })
  }),
  assignUserData: firebaseAction(({ state }, user) => {
    return userRef.child(user.uid).update({
      name: user.displayName,
      email: user.email,
      id: user.uid,
      photo: user.photoURL
    }).catch((err) => {
      console.log(err)
    })
  }),
  updateUserData: firebaseAction(({ state }, { userId, userData }) => {
    return userRef.child(userId).update(userData)
  }),
  assignTopicToUser: firebaseAction(({ state }, { userId, topicData }) => {
    return userRef.child(userId)
      .child('topics')
      .push(topicData)
  }),
  updateUserTopic: firebaseAction(({ state }, { userId, topicKey, data }) => {
    // data: topicId, author, speaker
    return userRef.child(userId)
      .child('topics')
      .child(topicKey)
      .update(data)
      .catch((err) => {
        console.log(err)
      })
  }),
  editTopic: firebaseAction(({ state, commit }, { topicId, topicData }) => {
    return topicRef.child(topicId).update(
      topicData
    ).then(() => {
      commit('notification/push', {
        message: i18n.t('alert.topic-changes-saved'),
        title: i18n.t('global.success'),
        type: 'success'
      }, { root: true })
    }).catch(err => {
      commit('notification/push', {
        message: err.message,
        title: i18n.t('global.error'),
        type: 'error'
      }, { root: true })
    })
  }),
  async onAuthStateChanged ({ state, commit, dispatch }) {
    try {
      await auth.onAuthStateChanged((user) => {
        if (!user) {
          commit('RESET_USER_DATA')
          commit('RESET_VOTES_DATA')
          return
        }
        const provider = user.providerData[0].providerId
        if (user.emailVerified || checkSocialLogin(provider)) {
          commit('SET_AUTH_USER', { user })
          dispatch('checkAdmin')
          dispatch('checkSubscription')
          dispatch('bindUser')
          commit('notification/push', {
            message: i18n.t('alert.logged-in-successfull'),
            title: i18n.t('global.success'),
            type: 'success'
          }, { root: true })
        } else {
          commit('SET_AUTH_USER', { user })
          // check if initMail was sent
          dispatch('checkinitEmailSent').then(() => {
            if (!state.user.initEmailSent) {
              dispatch('sendEmailVerification')
            }
          })
        }
      })
    } catch (err) {
      commit('notification/push', {
        message: err.message,
        title: i18n.t('global.error'),
        type: 'error'
      }, { root: true })
    }
  },
  upvote: firebaseAction(({ state, dispatch, commit }, data) => {
    return userRef.child(state.user.id).child('votes').push({
      [data.id]: true
    }).then(() => {
      data.votes++
      dispatch('updateVotes', { id: data.id, votes: data.votes })
    }).catch((err) => {
      commit('notification/push', {
        message: err.message,
        title: i18n.t('global.error'),
        type: 'error'
      }, { root: true })
    })
  }),
  downvote: firebaseAction(({ state, dispatch, commit }, data) => {
    return userRef.child(state.user.id)
      .child('votes')
      .child(data.itemKey)
      .remove()
      .then(() => {
        data.votes--
        dispatch('updateVotes', { id: data.id, votes: data.votes })
      }).catch((err) => {
        commit('notification/push', {
          message: err.message,
          title: i18n.t('global.error'),
          type: 'error'
        }, { root: true })
      })
  }),
  updateVotes: firebaseAction(({ commit, dispatch }, data) => {
    return topicRef.child(data.id).update({
      votes: data.votes
    }).then(() => {
      dispatch('bindUser')
    }).catch((err) => {
      commit('notification/push', {
        message: err.message,
        title: i18n.t('global.error'),
        type: 'error'
      }, { root: true })
    })
  }),
  approveTopic: firebaseAction(({ commit }, data) => {
    return topicRef.child(data).update({
      approved: true,
      rejected: false
    }).catch((err) => {
      commit('notification/push', {
        message: err.message,
        title: i18n.t('global.error'),
        type: 'error'
      }, { root: true })
    })
  }),
  rejectTopic: firebaseAction(({ commit }, data) => {
    return topicRef.child(data).update({
      rejected: true,
      approved: false
    }).catch((err) => {
      commit('notification/push', {
        message: err.message,
        title: 'Error',
        type: 'error'
      }, { root: true })
    })
  }),
  addToApproval: firebaseAction(({ commit }, data) => {
    return topicRef.child(data).update({
      rejected: false,
      approved: false
    }).catch((err) => {
      commit('notification/push', {
        message: err.message,
        title: 'Error',
        type: 'error'
      }, { root: true })
    })
  }),
  async checkAdmin ({ commit, state }) {
    try {
      await userRef
        .child(state.user.id)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            const snap = snapshot.val()
            if (snap.admin) {
              commit('SET_ADMIN')
            }
          }
        })
    } catch (err) {
      console.log(err)
    }
  },
  async checkinitEmailSent ({ commit, state }) {
    try {
      await userRef
        .child(state.user.id)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            const snap = snapshot.val()
            if (snap.initEmailSent) {
              commit('INIT_EMAIL_SENT')
            }
          }
        })
    } catch (err) {
      console.log(err)
    }
  },
  sendEmailVerification ({ state, dispatch, commit }) {
    const user = auth.currentUser
    if (!state.user.initEmailSent) {
      dispatch('setInitEmailSent')
    }
    const redirect = {
      url: `${window.location.href}?verified=true`
    }
    user.sendEmailVerification(redirect).then(() => {
      // set in db that init email was send if needed
      if (!state.user.initEmailSent) {
        dispatch('setInitEmailSent')
      }
      commit('notification/push', {
        message: i18n.t('alert.email-verification-sent', { email: user.email }),
        title: '',
        type: 'info'
      }, { root: true })
    }).catch((err) => {
      commit('notification/push', {
        message: err.message,
        title: i18n.t('global.error'),
        type: 'error'
      }, { root: true })
    })
  },
  setInitEmailSent: firebaseAction(({ state, commit }) => {
    return userRef.child(state.user.id).update({
      initEmailSent: true
    }).then(() => {
      commit('INIT_EMAIL_SENT')
    })
  }),
  setLinkingAccount ({ commit }, payload) {
    commit('SET_LINK_ACCOUNT', payload)
  },
  async checkSubscription ({ commit, state }) {
    try {
      await userRef
        .child(state.user.id)
        .once('value', snapshot => {
          if (snapshot.exists()) {
            const snap = snapshot.val()
            if (snap.newsletter) {
              commit('SET_NEWSLETTER')
            }
          }
        })
    } catch (err) {
      console.log(err)
    }
  }
}
