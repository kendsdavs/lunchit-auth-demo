const React = require('react')
const { Match, BrowserRouter, HashRouter, Redirect } = require('react-router')
const { Home, About, Favorites, FavoriteForm, Favorite } = require('./pages')
//const Auth = require('./utils/auth-service')

const auth = require('./utils/auth') (
  process.env.REACT_APP_ID,
  process.env.REACT_APP_DOMAIN
)

const App = React.createClass({
  getInitialState() {
    return {
        loggedout:false
    }

  },
  logout() {
    console.log('logout!')
    auth.logout()
    this.setState({loggedout: true})

  },
  render() {
    return (

      <HashRouter>
        <div>
          {this.state.loggedIn === false ? <Redirect to="/" /> : null }
          <Match exactly pattern="/" render={(props) => <Home {...props} auth={auth} />} />
          <MatchWhenAuthorized exactly pattern="/favorites" component={Favorites} logout={this.logout} />
          <MatchWhenAuthorized pattern="/favorites/new" component={FavoriteForm} logout={this.logout} />
          <MatchWhenAuthorized exactly pattern="/favorites/:id/show" component={Favorite} logout={this.logout} />
          <MatchWhenAuthorized pattern="/favorites/:id/edit" component={FavoriteForm} logout={this.logout} />
          <MatchWhenAuthorized pattern="/about" component={About} logout={this.logout} />

        </div>
      </HashRouter>


    )
  }
})
//useds so we didn't have to apply the Authorization code 5 times. we just call the package
const MatchWhenAuthorized = ({component: Component, logout: logout, ...rest}) =>
  <Match {...rest} render={props => auth.loggedIn() ?
    <div>
      <div style={{float: 'right'}}><button onClick={logout}>Logout</button></div>
      <Component {...props} logout={logout} />
    </div> : <Redirect to="/" /> } />


module.exports = App
