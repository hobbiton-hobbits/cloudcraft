const router = require('express').Router();
const { getUsers, getGroups, addGroup } = require('../db/dbLogic.js');

router.get('/users', async (req, res) => {
  const result = await getUsers();
  res.send(result);
});

router.get('/groups', async (req, res) => {
  const result = await getGroups();
  res.send(result);
})

router.post('/groups', async (req, res) => {
  const { username, ids } = req.body;
  const result = await addGroup(username, ids);
  res.send(result);
})

module.exports = router;