const express = require('express');
var app = express();
const router = express.Router();
var server = require('https').Server(app)
const fs = require('fs');
const bodyParser = require('body-parser');
const PORT = 3000;
const PAGE_ACCESS_TOKEN = 'abc';
const data = require('./db.json')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
  res.setHeader("Content-Type",'application/json');
  res.send(JSON.stringify(data.login));
});

app.get('/singUp', (req, res) => {
  res.setHeader("Content-Type",'application/json');
    res.json(JSON.stringify(data.singUp));
});

app.post('/login', function (req, res) {
  const {id, email, password} = req.body;
  const user = JSON.stringify(req.body);
  console.log('request = ' + user); 
  data.login.push(req.body);
  res.send(user);
  res.end();
})

app.post('/singUp', function (req, res) {
  const {id, email, password, username} = req.body;
  const user = JSON.stringify(req.body);
  console.log('request = ' + user); 
  data.login.push(req.body);
  res.send(user);
  res.end();
})

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});