import axios from 'axios'

export default {
  data () {
    return {
      apiKey: process.env.CM_API_KEY
    }
  },
  methods: {
    async subscribe ({ name, email, lang }) {
      await axios({
        url: `${process.env.VUE_APP_URL}api/v3.2/subscribers/dab4deeb7a44a49d5f465d6e16741f3e.json`,
        method: 'post',
        auth: {
          username: this.apiKey,
          password: 'x'
        },
        data: {
          Name: name,
          EmailAddress: email,
          ConsentToTrack: 'Yes',
          CustomFields: [
            {
              key: 'Preferredlanguage',
              value: lang
            }
          ]
        }
      })
    }
  }
}
