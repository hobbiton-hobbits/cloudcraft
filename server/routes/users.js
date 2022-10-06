const router = require('express').Router();
const { getUsers, updatePhoto, getGroups, addGroup, getMessages, editMessage, deleteMessage, getTasks, addTask, completeTask } = require('../db/dbLogic.js');

router.get('/users', async (req, res) => {
  const { userId } = req.query;
  const result = await getUsers(userId);
  res.send(result.rows);
});

router.put('/updatePhoto', async (req, res) => {
  await updatePhoto(req.body).then(() => {
    res.sendStatus(201);
  }).catch(err => {
    console.log('Update photo error: ', err)
    res.sendStatus(400);
  })
})

router.get('/groups', async (req, res) => {
  const { userId } = req.query;
  const result = await getGroups(userId);
  res.send(result.rows);
})

router.post('/groups', async (req, res) => {
  const { ids, names } = req.body;
  const result = await addGroup(ids, names);
  res.send(result);
  // res.send('post group received');
})

router.get('/messages', async (req, res) => {
  const { userId, recipientId, groupId } = req.query;
  const result = await getMessages(userId, recipientId, groupId);
  res.send(result.rows);
})

router.put('/messages', async (req, res) => {
  const { messageId, text } = req.body;
  const result = await editMessage(messageId, text);
  res.send(result);
})

router.delete('/messages', async(req, res) => {
  const { messageId } = req.body;
  const result = await deleteMessage(messageId);
  res.send(result);
})

router.get('/tasks', async (req, res) => {
  const { userId } = req.query;
  const result = await getTasks(userId);
  res.send(result.rows);
})

router.post('/tasks', async (req, res) => {
  const { userId, text, messageId } = req.body;
  const result = await addTask(userId, text, messageId);
  res.send(result);
})

router.put('/tasks', async (req, res) => {
  const { taskId } = req.body;
  const result = await completeTask(taskId);
  res.send(result);
})

router.put('/updatePhoto', async (req, res) => {
  await updatePhoto(req.body).then(() => {
    res.sendStatus(201);
  }).catch(err => {
    console.log('Update photo error: ', err)
    res.sendStatus(400);
  })
})

module.exports = router;