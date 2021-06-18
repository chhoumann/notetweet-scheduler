const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const autoTweetApi = require('./autoTweet.js');
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

app.post('/postTweet', async (req, res) => {
    console.log(req);
    await autoTweetApi.TweetHandler(req.body);

    res.send("Thanks!");
})

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 2020;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

const got = require('got');
setInterval(function() {
    got.get("http://notetweet.herokuapp.com");
}, 300000); // every 5 minutes (300000)