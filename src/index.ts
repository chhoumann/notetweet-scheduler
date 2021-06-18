import {Request, Response} from "express";
import {TweetStore} from "./tweetStore";
import {ITweet} from "./ITweet";
import {Tweet} from "./Tweet";

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

new TweetStore().init();

app.post('/postTweetNow', async (req: Request, res: Response) => {
    if (req.body.password !== process.env.PASSWORD) {
        res.send({success: false, error: "wrong password"});
        return;
    }



    res.send({success: true});
});

app.post("/scheduleTweet", async (req: Request, res: Response) => {
    if (req.body.password !== process.env.PASSWORD) {
        res.send({success: false, error: "wrong password"});
        return;
    }

    const {date, tweet} = req.body;
    if (!date || !tweet) {
        res.send({success: false, error: "date or tweet invalid"});
        return;
    }

    const newTweet: ITweet = new Tweet(tweet.id, tweet.tweet, date);
    new TweetStore().addTweet(newTweet);

    schedule.scheduleJob(date, async () => {
        await autoTweetApi.TweetHandler(req.body.tweet);
    });

    res.send({success: true});
});

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