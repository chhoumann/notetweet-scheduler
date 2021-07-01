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
const middlewares = require('./middlewares');
require('dotenv').config();

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

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 2020;
app.listen(port, (err: any) => {
    if (err) {
        console.log(err);
    }
    console.log(`Listening at ${getOrigin()} on port ${port}`);
});

(async () => await new TweetStore().init())();

function getOrigin(): string {
    return (process.env.ORIGIN || `http://localhost:${port}`);
}

console.log("Origin: ", getOrigin());

const got = require('got');
setInterval(function() {
    got.get(getOrigin());
}, 300000); // Prevent the app from sleeping.

cron.schedule("* * * * *", async () => {
    console.log(new Date(), " - Looking for something to post.");

    const tweetStore: TweetStore = new TweetStore();

    const result = await tweetStore.getTweets();
    // @ts-ignore
    const tweets: ITweet[] = result.rows;
    console.log("Tweets:", tweets);
    // @ts-ignore
    let tweetsToPost = tweets.filter(t => {
        const postAt: Date = new Date(t.postat);
        const dateNow: Date = new Date(Date.now());
        const minutes: number = getMinutesBetweenDates(postAt, dateNow);
        
        if (minutes > 0) return t;
    })

    if (!tweetsToPost) return;

    for (const tweetToPost of tweetsToPost) {
        await autoTweetApi.TweetHandler(tweetToPost);
        console.log(`Posted tweet\n${tweetToPost.content.join('\n')}`);

        await tweetStore.deleteTweet(tweetToPost.id);
    }
});

function getMinutesBetweenDates(date1: Date, date2: Date): number {
    const diff = date2.getTime() - date1.getTime();
    return diff / (1000 * 60);
}