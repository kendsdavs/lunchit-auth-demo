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
