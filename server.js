const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const ejs = require('ejs');
app.set('view engine', 'ejs');

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile.js')[environment];
const knex = require('knex')(knexConfig);


const bcrypt = require('bcrypt-as-promised');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get All Users
app.get('/users', function(req, res, next){
  knex('users')
  .then(function(users){
    res.render('index', { users });
  })
})

//Get All todos
app.get('/todos', function(req, res, next){
  knex('todos')
  .then(function(todos){
    res.render('todos', { todos })
  })
})

//Create a user
app.post('/users', function(req,res,next){
  const { username, password } = req.body;
  bcrypt.hash(password, 12)
  .then(function(hashed_password){
    return knex('users').insert({ username, hashed_password});
  })
  .then(function(){
    res.redirect('/users');
  })
  .catch(function(err){
    next(err);
  });
});

//Create a Todo
app.post('/users/:user_id/todos', function(req,res,next){
  const user_id = req.params.user_id;
  knex('todos')
  .insert({
    task: req.body.task,
    user_id: user_id
  })
  .then(function(){
    res.redirect('/users/'+user_id)
  })
})

//Get a specific user
app.get('/users/:id', function(req,res,next){
  knex('users')
  .where('id',req.params.id)
  .first()
  .then(function(user){
    knex('todos')
    .where('user_id', req.params.id)
    .then(function(todos){
      res.render('user', {user, todos});
    })
  })
})

app.listen(port, function(){
  console.log('Listening on port', port);
})
