const knex = require('knex');
const knexConfig = require('../knexConfig');
const Knex = knex(knexConfig);
const {config} = require('../config'); 
const jwt = require('jsonwebtoken'); 

const authenticate = async (req, res) => {
  const { info } = req.body;
  console.log('auth for ', info);
  const message = {token: null, error : { userName: false, password: false }};

  const users = await Knex.raw('Select * from users where username = ? ', [info.userName]);



  if (users.rows.length === 0) {
    message.error.userName = true;
    res.json(message);
    return;
  }

  if (users.rows[0].pass != info.password) {
    message.error.password = true;
    res.json(message);
    return;
  }
  

  message.token = jwt.sign({username: info.userName}, config.key, {algorithm: 'HS256'}); 

  res.json(message);
};

const register = async (req, res) => {

  const { info } = req.body;
  const message = {token: null, error: {userName : false, password: false}};  
  console.log('signup for ', info);

  if (info.password.trim() != info.confirmPassword )
  {
    message.error.password = true; 
    res.json(message);        
    return;
  }

  const query = await Knex.raw('Select * from users where username = :username', {username: info.userName}); 
  if(query.rows.length != 0){
    message.error.userName = true; 
    res.json(message); 
    return; 
  }
  
  await Knex.raw('Insert into users (username, pass) values (:username, :pass)', {
    username: info.userName, 
    pass: info.password,   
  }) 
  
  message.token = jwt.sign({username: info.userName}, config.key, {algorithm: 'HS256'}); 
  res.json(message);
}

module.exports = {
  authenticate,
  register
};
