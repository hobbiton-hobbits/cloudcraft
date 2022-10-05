const router = require('express').Router();
const { getUsers, getGroups, addGroup, getMessages } = require('../db/dbLogic.js');

router.get('/users', async (req, res) => {
  const { userId } = req.query;
  console.log('user id: ', userId)
  const result = await getUsers(userId);
  console.log('result: ', result)
  res.send(result.rows);
});

router.get('/groups', async (req, res) => {
  const { userId } = req.query;
  const result = await getGroups(userId);
  res.send(result.rows);
})

router.post('/groups', async (req, res) => {
  const { ids } = req.body;
  const result = await addGroup(ids);
  res.send(result);
  // const { ids, names } = req.body;
  // const result = await addGroup(ids, names);
  // res.send(result);
})

// router.get('/messages', async (req, res) => {
//   const { userId, groupId, recipientId } = req.query;
//   const result = await getMessages(userId, null, groupId)
//   res.send(result.rows);
// })

module.exports = router;