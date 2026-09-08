const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const notebooksRouter = require('./routes');
const app = express();

app.use(bodyParser.json());
app.use('/api/notebooks',notebooksRouter);

const port = process.env.PORT;

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('connected to mongodb, starting notebooks server');
    app.listen(port, () =>
        console.log(`Notebooks server listening on port ${port}`)
    );
}).catch(err => {console.error('Something went wrong:', err)});

