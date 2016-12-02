const React = require('react')
const {Link} = require('react-router')

const About = React.createClass({
  render() {
    return (
      <div>
        <h1>About LunchIt</h1>
        <Link to="/">Home</Link>
      </div>
    )
  }
})

module.exports = About
