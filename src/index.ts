import {Request, Response} from "express";
import {TweetStore} from "./tweetStore";
import {CronStringStore} from "./cronStringStore";

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

new TweetStore().init();
new CronStringStore().init();

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

const cronTasks: any[] = [];

function scheduleCronStrings() {
    new CronStringStore().getCronStrings().forEach((str) => {
        const task = cron.schedule(str, async () => {
            const tweetStore: TweetStore = new TweetStore();

            const tweets = tweetStore.getTweets();
            if (!tweets) return;
            const tweetToPost = tweets[0];
            if (!tweetToPost) return;

            await autoTweetApi.TweetHandler(tweetToPost);
            console.log(`Posted tweet\n${tweetToPost.content.join('\n')}`);

            tweetStore.deleteTweet(tweetToPost.id);
        });

        cronTasks.push(task);
    });
}

function updateCronStrings(cronStrings: string[]) {
    new CronStringStore().writeCronStrings(cronStrings);
    scheduleCronStrings();
}

scheduleCronStrings();