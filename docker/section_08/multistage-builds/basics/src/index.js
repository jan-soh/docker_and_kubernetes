const express = require('express');
const {listen} = require("express/lib/application");

const app = express();

const port = process.env.PORT;
app.get('/', (req, res) => res.send('Hello from express!'));

app.listen(port, () => console.log(`listening on port ${port}`));