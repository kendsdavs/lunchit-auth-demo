require('dotenv').config()

const jwt = require('express-jwt')

module.exports = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_ID
})

// module.exports = function (req, res, next) {
//   // get the jwt token from the request
//   // verify the token against our secret
//   // if valid -- continue
//   // otherwise - access denied!! 403
// }
