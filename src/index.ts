import {Request, Response} from "express";
import {TweetStore} from "./tweetStore";
import {ITweet} from "./ITweet";

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const autoTweetApi = require('./autoTweet.js');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const tweetRoutes = require('./tweetRoutes')
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
app.use(tweetRoutes)

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

(async () => await new TweetStore().init())();

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

cron.schedule("* * * * *", async () => {
    console.log(new Date(), " - Looking for something to post.");

    const tweetStore: TweetStore = new TweetStore();

    const result = await tweetStore.getTweets();
    console.log("Result:", result)
    // @ts-ignore
    const tweets: ITweet[] = JSON.parse(result.rows);
    console.log("Tweets:", tweets);
    let tweetsToPost = tweets.filter(t => {
        const postAt: Date = new Date(t.postat);
        const dateNow: Date = new Date(Date.now());
        // @ts-ignore
        const diff = Math.abs(postAt - dateNow);
        const minutes = Math.floor(diff/1000/60);
        if (minutes < 1) return t;
    })
    if (!tweetsToPost) return;

    for (const tweetToPost of tweetsToPost) {
        await autoTweetApi.TweetHandler(tweetToPost);
        console.log(`Posted tweet\n${tweetToPost.content.join('\n')}`);

        await tweetStore.deleteTweet(tweetToPost.id);
    }
});