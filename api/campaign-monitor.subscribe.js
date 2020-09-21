const axios = require('axios')
const get = require('lodash.get')

const apiKey = process.env.CM_API_KEY

async function subscribe (lang, email, name) {
  console.log(`Subscribing ${email}`)
  await axios({
    url: 'https://api.createsend.com/api/v3.2/subscribers/dab4deeb7a44a49d5f465d6e16741f3e.json',
    method: 'post',
    auth: {
      username: apiKey,
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

function cors (request, response) {
  const origin = request.headers.origin
  const allowedOrigins = [
    'http://localhost:8080',
    'https://topics-voting-app-*.vercel.app',
    'https://topics-voting-app-test.vercel.app',
    'https://vote.meetmagento.pl'
  ]

  if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
  }

  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST')
  response.setHeader('Access-Control-Allow-Headers', 'content-type')
  response.setHeader('Access-Control-Max-Age', 2592000)

  if (request.method === 'OPTIONS') {
    response.statusCode = 204
    response.end()
  }
}

function getData (request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', chunk => {
      body += chunk
    })

    request.on('end', () => {
      resolve(JSON.parse(body))
    })

    request.on('error', error => {
      reject(error)
    })
  })
}

module.exports = async (request, response) => {
  try {
    cors(request, response)

    if (request.method === 'POST') {
      const data = await getData(request)
      await subscribe(data.lang, data.email, data.name)
      response.end('Successfuly subscribed!')
    }
  } catch (error) {
    console.error(error)
    response.end(get(error, 'response.data.Message') || 'Something went wrong')
  }
}
