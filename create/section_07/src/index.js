const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;
const users = [];

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// get registered users
app.get('/users', (req, res) => {
  return res.json({users});
})

// register new user
app.post('/register', (req, res) => {

  const newUserId = req.body.userId;

  if (!newUserId) {
    res.status(400).send('userId is required');
  }

  if (users.includes(newUserId)) {
    res.status(400).send('userId already exists');
  }

  users.push(newUserId);
  res.status(201).send('userId registered');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));