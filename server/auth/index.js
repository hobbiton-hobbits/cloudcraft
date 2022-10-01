require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const port = process.env.AUTHPORT;
const db = require('./authdb');
const jwt = require('jsonwebtoken');


const app = express();

//MIDDLEWARE
app.use(cors());
app.use(compression());
app.use(express.json());

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`)
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}

app.get('/auth', authenticateToken, (req, res) => {
  res.send(req.user.name + ' is logged in');
})

app.post('/login', (req, res) => {
  //AUTHENTICATE USER BY CHECKING DATABASE AND PASSWORD

  //SEND TOKEN BACK
  const username = req.body.username;
  const user = {
    name: username,
  }
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken});
});