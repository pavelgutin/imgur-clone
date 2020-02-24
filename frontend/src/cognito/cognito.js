// The imports we need from both aws-sdk and the cognito js library
import { Config, CognitoIdentityCredentials } from 'aws-sdk'
import { CognitoUser, CognitoUserPool, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js'

import config from '@/config'

// We'll want to create a class for CognitoAuth which will
// contain all the methods we will need within our App
export default class CognitoAuth {
  // The constructor for this class will initialize our userSession
  // as null
  constructor() {
    this.userSession = null
  }

  // this will set up our app to use cognito to use
  // the user pool that we'll be creating later on
  configure(config) {
    if (typeof config !== 'object' || Array.isArray(config)) {
      throw new Error('[CognitoAuth error] valid option object required')
    }
    this.userPool = new CognitoUserPool({
      UserPoolId: config.IdentityPoolId,
      ClientId: config.ClientId
    })
    Config.region = config.region
    Config.credentials = new CognitoIdentityCredentials({
      IdentityPoolId: config.IdentityPoolId
    })
    this.options = config
  }

  // a signup function which will allow new people
  // to create an account in our app
  signup(username, email, pass, cb) {
    let attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ]

    this.userPool.signUp(username, pass, attributeList, null, cb)
  }

  // a function that will allow existing users to
  // authenticate with our application
  authenticate(username, pass, cb) {

    console.log(username)
    console.log(pass)
    console.log(config.UserPoolId)
    let authenticationData = { Username: username, Password: pass }
    let authenticationDetails = new AuthenticationDetails(authenticationData)
    let userData = { Username: username, Pool: this.userPool }
    let cognitoUser = new CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var logins = {}
        logins['cognito-idp.' + config.region + '.amazonaws.com/' + config.UserPoolId] = result.getIdToken().getJwtToken()

        Config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: config.UserPoolId,
          Logins: logins
        })
        cb(null, result)
      },
      onFailure: function (err) {
        cb(err);
      },
      newPasswordRequired: function (userAttributes, requiredAttributes) {
        console.log('New Password Is Required' + userAttributes + requiredAttributes)
      }
    })
  }

  isAuthenticated(cb) {
    let cognitoUser = this.getCurrentUser()
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          return cb(err, false)
        }
        return cb(session, true)
      })
    } else {
      cb(null, false)
    }
  }

  // a helper function that allows us to
  // get the information for the current user
  getCurrentUser() {
    return this.userPool.getCurrentUser()
  }

  // a function that allows us to confirm newly
  // registered users of our app
  confirmRegistration(username, code, cb) {
    let cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool
    })
    cognitoUser.confirmRegistration(code, true, cb)
  }

  // does what it says on the tin, allows users
  // to logout if they are already logged in
  logout() {
    this.getCurrentUser().signOut()
  }

  // Retrieve the users current token if they have
  // a session, otherwise returns null
  getIdToken(cb) {
    if (this.getCurrentUser() == null) {
      return cb(null, null)
    }
    this.getCurrentUser().getSession((err, session) => {
      if (err) return cb(err)
      if (session.isValid()) {
        return cb(null, session.getIdToken().getJwtToken())
      }
      cb(Error('Session is invalid'))
    })
  }
}

// This installed CognitoAuth into our Vue instance
CognitoAuth.install = function (Vue, options) {
  Object.defineProperty(Vue.prototype, '$cognitoAuth', {
    get() { return this.$root._cognitoAuth }
  })

  Vue.mixin({
    beforeCreate() {
      if (this.$options.cognitoAuth) {
        this._cognitoAuth = this.$options.cognitoAuth
        this._cognitoAuth.configure(options)
      }
    }
  })
}