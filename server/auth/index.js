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
  console.log('I AM INFO:', req.body);
  const user = {username: req.body.username, password: hashedPassword, firstName: req.body.firstName, lastName: req.body.lastName};
  //See if Username is taken
  await db.query(`Select username from auth where username = '${user.username}';`)
    .then( async (result) => {
      if (result.rows.length > 0) {
        res.status(500).send('Username Already Taken')
      } else {
        await db.query(`INSERT INTO auth (username, password, firstName, lastName) VALUES ('${user.username}', '${user.password}', '${user.firstName}', '${user.lastName}');`)
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
  res.send('Logged in');
})


app.post('/login', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password
  }
  //AUTHENTICATE USER BY CHECKING DATABASE AND PASSWORD
  db.query(`SELECT * FROM auth WHERE username = '${user.username}';`)
    .then(async (result) => {
      const userInfo = {
        username: result.rows[0].username,
        firstName: result.rows[0].firstName,
        lastName:result.rows[0].lastName
      };
      let isTrue = await bcrypt.compare(user.password, result.rows[0].password);
      if (!isTrue) {
        res.status(400).send('Incorrect Password')
      } else {
        //SEND TOKEN BACK
        const accessToken = jwt.sign({username: user.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
        const refreshToken = jwt.sign(user.username, process.env.REFRESH_TOKEN_SECRET);
        db.query(`SELECT tokenid FROM refreshTokens WHERE tokenid = '${refreshToken}';`)
          .then((result) => {
            if (result.rows.length === 0) {
              db.query(`INSERT INTO refreshTokens (tokenid) VALUES ('${refreshToken}');`)
                .then((result) => {
                  res.status(201).json({accessToken: accessToken, refreshToken: refreshToken});
                })
                .catch((err) => {
                  console.log(err);
                  res.sendStatus(400);
                });
            } else {
              res.status(201).json({accessToken: accessToken, refreshToken: refreshToken, username: userInfo.username, firstName: userInfo.firstName, lastName: userInfo.lastName});
            }
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(400);
          });
      }
    })
    .catch((err) => {
      res.status(400).send('Username Not Found');
    });
});

app.get('/refresh', (req, res) => {
  const authHeader = req.headers['Authorization']
  const refreshToken = authHeader && authHeader.split(' ')[1];
  console.log('I HAVE REFRESHED:', refreshToken);
  if (refreshToken === null) {
    console.log('FIRST 401');
    res.status(401).send('FIRST 401');
  } else {
    db.query(`SELECT tokenid FROM refreshtokens where tokenid = '${refreshToken}';`)
      .then((result) => {
        if (result.rows.length === 0) {
          res.sendStatus(403);
        } else {
          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
              res.sendStatus(403);
            } else {
              const accessToken = jwt.sign({username: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
              res.json({accessToken: accessToken});
            }
          })
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send('SECOND 401');
      })
  }
});

app.delete('/logout', (req, res) => {
  const authHeader = req.headers['Authorization']
  const refreshToken = authHeader && authHeader.split(' ')[1];
  db.query(`DELETE FROM refreshTokens where tokenid = '${refreshToken}';`)
    .then((result) => {
      res.status(203).send('Logout Successful');
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    })
});