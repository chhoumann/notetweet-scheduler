import {Request, Response} from "express";

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const autoTweetApi = require('./autoTweet.js');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.post('/postTweet', async (req: Request, res: Response) => {
    console.log(req.body.password === process.env.PASSWORD);
    const rule = new schedule.RecurrenceRule();
    rule.second = 10;

    const job = schedule.scheduleJob(rule, async () => {
        const test = await autoTweetApi.TweetHandler(req.body.tweet);
        console.log("test:", test);
    });
    console.log(job);

    res.send({rule});
})

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 2020;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

const got = require('got');
setInterval(function() {
    got.get(process.env.ORIGIN);
}, 300000); // Prevent the app from sleeping.