const express = require('express');
const mongoose = require('mongoose');
const noteRouter = require('./routes');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use('/api/notes', noteRouter);

const port = process.env.PORT;

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('connected to mongodb, starting notes server');
    app.listen(port, () =>
        console.log(`Notes server listening on port ${port}`)
    );
}).catch(err => {console.error('Something went wrong:', err)});

