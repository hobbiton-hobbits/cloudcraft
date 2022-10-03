

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const port = process.env.AUTHPORT;
const db = require('./authdb');
const jwt = require('jsonwebtoken');
const app = express();
//
const bcrypt = require('bcrypt');



//MIDDLEWARE
app.use(cors());
app.use(compression());
app.use(express.json());

const users = [];

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

app.post('/register', async (req, res) =>{
  // save to database

  //salt
  try{
    const salt = await bcrypt.genSalt();

    //hash password
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = {name: req.body.name, password: hashedPassword}

    //save to database
    await MODELNAME.create({user});
  } catch {
    res.status(500).send('error creating user')
  }
})


app.get('/auth', authenticateToken, (req, res) => {
  res.send(req.user.name + ' is logged in');
})

app.post('/login', async (req, res) => {
  //AUTHENTICATE USER BY CHECKING DATABASE AND PASSWORD
  //find user in database
  const user = await MODELNAME.findOne({where: {name: req.body.name }});

  if (user === null) {
    res.status(400).send('user not found');
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('user found')
    } else {
      res.send('not allowed')
    }
  } catch {
    res.status(500).send('authenticated')
  }

  //SEND TOKEN BACK
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken});
});
