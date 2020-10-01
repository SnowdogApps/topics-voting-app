// Get a RTDB & auth instance
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const app = firebase.initializeApp({
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DB_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
})
export const db = app.database()
export const topicRef = db.ref('topics')
export const userRef = db.ref('users')
export const auth = app.auth()
