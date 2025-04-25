
const {config} = require('./config'); 
const jwt = require('jsonwebtoken')

const authorize = (token, username) => {
  var val = true; 
  
  jwt.verify(token, config.key, (err, decoded) => {
    if (err) {
      console.log('token error: ', err);
      val = false;
      return;
    }
    if (decoded.username != username) {
      console.log('username does not match')
      val = false;
      return;
    }

    // console.log(`${username} authorized`); 
  })
  return val ;
}
module.exports = {authorize}; 