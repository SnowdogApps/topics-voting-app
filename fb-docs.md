# Firebase configuration for Topic Poll app

## Base configuration
1. Create app
2. Set global variables in .env (use `.env.production` and `env.development` if needed):
* Credential from firebase app config:

```
VUE_APP_API_KEY=apiKey
VUE_APP_AUTH_DOMAIN=authDomain
VUE_APP_DB_URL=databaseURL
VUE_APP_PROJECT_ID=projectId
VUE_APP_STORAGE_BUCKET=storageBucket
VUE_APP_MESSAGING_SENDER_ID=messagingSenderId
VUE_APP_APP_ID=appId
```
* deployment url:
```
VUE_APP_URL="<hosting url>"
```
* i18n global variables with choosen default app language:
```
VUE_APP_I18N_LOCALE=en
VUE_APP_I18N_FALLBACK_LOCALE=en
```
* Facebook app id:
```
VUE_APP_FB_APP_ID=fbAppId
```
## Deploying
App can be deployed with different tools.
Here some example of deploy with Firebase and Vercel:

### Deploying with firebase:
1. Install firebase-cli globbaly (`npm install -g firebase-tools`)
This allows to deploy project from repo on local
2. login to firebase `firebase login`
3. init firebase project `firebase init`
4. To keep root alive add rewrites for routes in `firebase.json`:
```json
"hosting": {
  "public": "dist",
   "rewrites": [
     {
        "source": "**",
        "destination": "/index.html"
    }
  ],
  "ignore": [
    "firebase.json",
    "**/.*",
    "**/node_modules/**"
  ]
}
```
5. Make sure that in `routes/index.js` you use `mode: history`:
```js
const router = new VueRouter({
  mode: 'history',
  routes
})
```
6. use following rules in `database.rules.json` file:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "upvoted": {
          ".indexOn": ["topic"]
        }
      }
    },
    "topics": {
      ".read": true,
    	".write": "auth.uid == auth.uid",
      "title": {
      	".validate": "newData.isString() && newData.val().length > 0"
      },
      "description": {
        ".validate": "newData.isString() && newData.val().length > 0"
      },
      "user": {
        ".validate": "newData.val() === auth.uid"
      }
    }
  }
}
```
7. deploy existing project: firebase deploy
8. set up log in methods in firebase console
* enable Email/Password
* enable Google

### Deploying with Vercel
Create project in Vercel for the repo, configure base setting and deployment, set app variables in Vercel project setting.
Required project configuration for deploy are available in [now.json](now.json)

## Authorisation & Social integration:
1. Go to Authorisation => Sing-in method and configure methods you need
2. Authorise domains:
In Authorisation => Sing-in method add domain from which you want to login to you firebase db
For more information see [firebase hints](https://support.google.com/firebase/answer/6400741)

1. Github:
* go to https://github.com/settings/developers
* create new OAuthApp
* Authorization callback URL: from firebase console, in sing-in methods config
* Client Id & Client Secret have to be copied to firebase console, in sing-in methods config
should work
2. Twitter
* Go to https://developer.twitter.com/en/apps and create new app
* Callback URLs: from firebase console, in sing-in methods config
* Check: Enable Sign in with Twitter
* Terms of Service URL, Privacy policy URL, Organization name & Organization website URL will be needed to collect email and use emails for linking different account providers
* API key & API Secret key have to be copied to firebase console, in sing-in methods config
* in App Permision set Access permission: Read-only & Additional permissions: Request email address
* set
3. Facebook
* go to https://developers.facebook.com/apps and create new app
* in Settings -> basic: in the field App Domains add page url and save
* on th ebootom add Platfor -> Web and set site URL as a page url ans save
* On the left add new Product -> Login Button
* Valid OAuth Redirect URIs add url from firebase console, in sing-in methods config
* copy App ID & App secret to firebase console, in sing-in methods config
* set
* add should not be in development mode for that enyone can log in with fb, in development mode user to tests should be added

4. To authorise app domain in Google, go to https://console.cloud.google.com/apis/credentials and add domain to firebase app

## Admin role in db
To see Admin's Dashboard on frontend, we have to set admin role manually

1. In Realtime Database => `users` => <user-id>
add field: `admin`: `true`

2. In Realtime Database => Rules
add admin user ID like following:
```json
"users": {
      ".read": "auth.uid == <admin-user-uid-as-a-string>",
      ".write": "auth.uid === <admin-user-uid-as-a-string>",
      "$uid": {
        ".read": "$uid === auth.uid || auth.uid === <admin-user-uid-as-a-string>",
        ".write": "$uid === auth.uid || auth.uid === <admin-user-uid-as-a-string>",
        "upvoted": {
        	".indexOn": ["topic"]
        }
      }
    },
```

TO DO: admin role should be adjusted with firebase Admin/SDK
