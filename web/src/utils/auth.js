const Auth0Lock = require('auth0-lock').default
const jwtDecode = require('jwt-decode')
const moment = require('moment')

module.exports = function(clientId, domain) {
  const lock = new Auth0Lock(clientId, domain, {})
  let notifyFunction = null

  lock.on('authenticated', _doAuthentication)

  function login() {
    lock.show()
  }

  function _doAuthentication (authResult) {
    setToken(authResult.idToken)
    lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) return console.log(error.message)
      localStorage.setItem('profile', JSON.stringify(profile))
      if (notifyFunction) { notifyFunction(profile) } //this is how we keep from having to log in twice
      console.log(JSON.stringify(profile, null, 2))
    })

  }

  function logout() {
    localStorage.removeItem('id_token') //localStorage is HTML5, part of my browser
    localStorage.removeItem('profile')
  }

  function setToken (idToken) {
    localStorage.setItem('id_token', idToken)
  }

  function getToken() {
    return localStorage.getItem('id_token')
  }

  function loggedIn() {
    return getToken() ? true : false  // !! forces getToken into boolean. return getToken() ? true : false
  }
  function notify(fn) {
    notifyFunction = fn // this function lets us know when the user has logged in.
  }
// check if webtoken is expired
// if so propt the user to login again
  if (getToken()) {
    const info = jwtDecode(getToken())
    console.log('current', moment().toString())
    console.log('expires', moment.unix(info.exp).toString())
    if(moment().isAfter(moment.unix(info.exp))) {
      logout()
    }
    console.log(jwtDecode(getToken()))
  }

  return {
    login,
    logout,
    loggedIn,
    setToken,
    getToken,
    notify
  }
}
