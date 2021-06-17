const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const {router} = require('./autoTweet.js');
require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
    res.json("{message: '📔🐦 at work.'}");
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
app.use(router);

const port = process.env.PORT || 2020;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});