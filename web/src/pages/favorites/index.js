const React = require('react')
const {Link} = require('react-router')
const data = require('../../utils/data')()
const { map } = require('ramda')
const Favorites = React.createClass({
  getInitialState() {
    return {
      favorites: []
    }
  },
  componentDidMount () {
    data.list('favorites')
      .then(favorites => this.setState({favorites}))
      .catch(err => {
        this.props.logout()
      })

  },
  render () {
    const transform = map(fav => {
      return <div key={fav.id}><Link to={`/favorites/${fav.id}/show`}>
        {fav.name}
      </Link></div>
    })
    return (
      <div className="container">
        <header>
          <h1>Favorites</h1>
          <Link to="/favorites/new">New Favorite</Link>
          <hr />
        </header>
        {transform(this.state.favorites)}
        <hr />
        <Link to="/">Menu</Link>
      </div>
    )
  }
})

module.exports = Favorites
