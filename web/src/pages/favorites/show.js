const React = require('react')
const data = require('../../utils/data')()
const {Link, Redirect} = require('react-router')
import confirm from 'react-confirm2';


const Favorite = React.createClass({
  getInitialState() {
    return {
      favorite: {
        id: '',
        name: ''
      },
      removed: false
    }
  },
  componentDidMount() {
    data.get('favorites', this.props.params.id)
        .then(favorite => this.setState({favorite}))

  },
  handleRemove(e){
    e.preventDefault()
    confirm('Are you sure you want to remove this favorite?', () => {
      data.remove('favorites', this.props.params.id, this.state.favorite)
        .then(favorite => this.setState({removed: true}))
    })
  },
  render() {
    return (
      <div className="container">
        {this.state.removed ? <Redirect to="/favorites" /> : null}
        <h1>{this.state.favorite.name}</h1>
        <Link to="/favorites">Return</Link>
        |
        <button onClick={this.handleRemove}>Remove</button>
        |
        <Link to={`/favorites/${this.state.favorite.id}/edit`}>Edit</Link>
      </div>
    )
  }
})

module.exports = Favorite
