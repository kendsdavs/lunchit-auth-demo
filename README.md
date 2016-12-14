## DEMO PROJECT TO INTEGRATE AUTH0 with React

//////////Tom's README//////////

---Resources
- https://auth0.com/docs/quickstart/spa/react
- https://auth0.com/docs/overview
- https://auth0.com/blog/

* Set up Auth0 account: Go to Auth0 —> Clients —> Create New —> Select React —> Settings —> copy client secret —> create .env under api folder —> type AUTH0_SECRET=<client secret>
* add localhost:3000 as Callback URL
* add localhost:3000 as CORS origin

## Step 1
Setting up the API to be secure
```
npm install express-jwt dotenv -S

```
Grab the id and secret from auth0's dashboard for our client access application.

Create a `.env` file

```
AUTH0_SECRET=[your secret here]
AUTH0_ID=[your id here]
```
Build our middleware
> Disclaimer: this middleware is built to work with express api apps...

Create a jwt-validate.js file.

```
```

Example api test server
```
npm install json-server -S
json -I -f package.json -e 'this.scripts.start = "json-server db.json --watch -- port 4000 -m ./jwt-validate"'
```

Create db.json
```
{
  persons: [],
  places: [],
  widgets: []
}
```

## Step 2
Setting the Web app

//in web application
npm install auth0-lock -S
jwt-decode and moment

Create '.env' file

```
.env file contains: REACT_APP_API=http://127.0.0.1:4000
REACT_APP_ID=<clientID from auth0 settings>
REACT_APP_DOMAIN=kendsdavs.auth0.com <domain from auth0 settings>
```
in `src/app.js` we want to include `src/utils/auth.js` file

```
const auth = require
```

Using React Router version 4, we want to create an Authorization Check function in our `app.js` component.
```
const MatchWhenAuthorized = ({component: Component, logout: logout, ...rest}) =>
  <Match {...rest} render={props => auth.loggedIn() ?
    <div>
      <div style={{float: 'right'}}><button onClick={logout}>Logout</button></div>
      <Component {...props} logout={logout} />
    </div> : <Redirect to="/" /> } />

```
Set a logout flag on getInitialState of our App Component:
```
getInitialState() {
  return {
      loggedout:false
  }
},
```
Create a logout method on our App Component
```
logout() {
  console.log('logout!')
  auth.logout()
  this.setState({loggedout: true})

},
```
In the app with the react router, use the HashRouter to allow for Auth0 to have a consistent callback url.

>NOTE: This currently is a bug with auth0 or react, it may be fixed in the future.  

On your login component page add the auth.login method call on componentDidMount
```
const React = require('react')
const { Link } = require('react-router')

const Home = React.createClass({
  getInitialState() {
    return {
      logout: false,
      picture: 'http://placekitten.com/60',
      nickname: ''
    }
  },
  componentDidMount() {
    this.props.auth.notify(profile => {
      this.setState({
        picture: profile.picture,
        nickname: profile.nickname
      })
    })
    if (!this.props.auth.loggedIn() && this.props.location.hash.indexOf('access_token') === -1) {
      this.props.auth.login()
    }
    if (localStorage.getItem('profile')) {
      this.setState({
        picture: JSON.parse(localStorage.getItem('profile')).picture
      })
    }
  },
  render() {
    return (
      <div className="container">
        <img style={{height: '60px'}} src={this.state.picture} />
        <p>{this.state.nickname}</p>
        <h1>LunchIt</h1>
        <h3>Menu</h3>
        <ul>
          <li>
            <Link to="/favorites">Favorites</Link>
          </li>
          <li>
            <a href="">Circles</a>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    )
  }
})

module.exports = Home
```
## Step 4

In order to make secure api calls, we need to pass the jwt token in the Authorizaion header as a Bearer token.


## Summary

* Notify React when auth status changes - like logout
* Performing exp check when the app is initialized to confirm that the token is not expired.
* Make sure to run both api directory and web directory at the same time.  



////////Kendra's README.md////////////
1. Go to Auth0 —> Clients —> Create New —> Select React —> Settings —> copy client secret —> create .env under api folder —> type AUTH0_SECRET=<client secret>  

2. - Create a function to get the jwt token from the request
   - verify the token agains our secret
   - if valid -- continue
   - otherwise give a 403 error of "access denied"
   - install the express-jwt middle ware to handle this.
   - write the code in the jwt-validate.js file.

3.  Add the client ID to the .env file.  The clientID is from the Auth0 website.

4.  Use dotenv to load environment variables from .env file.  Npm install then put "require('dotenv').config()" at the beginning of jwt-validate.js file.  

5.  Type in the command line: "start": "json-server db.json --watch --port 4000 -m ./jwt-validate.js"

---- Setting the Web App ----

6. npm install auth0-lock -S.

7.  Create auth.js file and require in auth0-lock.

8. Create a Web Folder with an .env. File contains: REACT_APP_API=http://127.0.0.1:4000
REACT_APP_ID=<clientID from auth0 settings>
REACT_APP_DOMAIN=kendsdavs.auth0.com <domain from auth0 settings>


9. Initialize a new instance of Auth0Lock configured with your application clientID and your account's domain at Auth0 in the auth.js file.

10. From this file export modules login, logout, loggedIn, setToken, getToken.  Will also need helper function _doAuthentication.

11.  Create a web/app.js file and require in React.

12.  In your home.js file, in componentDidMount check for authorization. componentDidMount() {
    if (!this.props.auth.loggedIn()) {
      this.props.auth.login()
    }
  },

13.  Add http://localhost:3000 (or whatever callback url) to Allowed Callback URLs on AUTH0

14. In app.js: add componentDidMount and Initial State

15. In data.js, add "Bearer" and Authorization headers. This can be factored out into a helper function to be in all the data functions. The data functions are: list, get, post, put, remove.

---ADD ONS ----

* To log a user out after a certain amount of time:
1.  require 'jwt-decode' and 'moment'.
2.  In auth.js:
if (getToken()) {
  const info = jwtDecode(getToken())
  console.log('current', moment().toString())
  console.log('expires', moment.unix(info.exp).toString())
  if(moment().isAfter(moment.unix(info.exp))) {
    logout()
  }
  console.log(jwtDecode(getToken()))
}
3.  In data.js: write a .then for all the functions that handle a response status of 401.

4.  In app.js: add the logout prop to Component in the MatchWhenAuthorized function.

5.  In favorites/index.js add a .catch(err => {this.props.logout()}

* Get user profile info to add profile pics or user name in page.

1.  In home.js get the 'profile' info in componentDidMount:

if (localStorage.getItem('profile')) {
  this.setState({
    picture: JSON.parse(localStorage.getItem('profile')).picture
  })
}

2.  getInitialState and set picture and nickname
3.  At the top of componentDidMount add:
this.props.auth.notify(profile => {
  this.setState({
    picture: profile.picture,
    nickname: profile.nickname
  })
})
The notify function keeps us from having to log in again.  

4.  Render in home.js
render() {
  return (
    <div className="container">
      <img style={{height: '60px'}} src={this.state.picture} />
      <p>{this.state.nickname}</p>
