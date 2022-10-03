require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const port = process.env.AUTHPORT;
const db = require('./authdb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

app.post('/register', async (req, res) =>{
  //salt
  const salt = await bcrypt.genSalt();
  //hash password
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create user
  const user = {username: req.body.username, password: hashedPassword};
  console.log(user);

  //See if Username is taken
  await db.query(`Select username from auth where username = '${user.username}';`)
    .then( async (result) => {
      if (result.rows.length > 0) {
        res.status(500).send('Username Already Taken')
      } else {
        await db.query(`INSERT INTO auth (username, password) VALUES ('${user.username}', '${user.password}');`)
          .then((data) => {
            res.status(201).send('Registered User')
          })
          .catch((err) => {
            res.status(500).send('error creating user')
          });
      }
    })
    .catch((err) => {
      res.status(500).send('Error Creating User')
    });
})



app.get('/auth', authenticateToken, (req, res) => {
  res.send(req.user.name + ' is logged in');
})


app.post('/login', async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password
  }
  //AUTHENTICATE USER BY CHECKING DATABASE AND PASSWORD
  await db.query(`SELECT password FROM auth WHERE username = '${user.username}'`)
    .then(async (result) => {
      let isTrue = await bcrypt.compare(user.password, result.rows[0].password);
      if (!isTrue) {
        res.status(400).send('Incorrect Login Credentials')
      } else {
        //SEND TOKEN BACK
        const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET);
        res.status(201).json({accessToken: accessToken});
      }
    })
    .catch((err) => {
      res.status(400).send('User Not Found');
    });
});