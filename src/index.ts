import {Request, Response} from "express";
import {TweetStore} from "./tweetStore";
import {ITweet} from "./ITweet";
import {Tweet} from "./Tweet";
import {CronStringStore} from "./cronStringStore";

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const autoTweetApi = require('./autoTweet.js');
const bodyParser = require('body-parser');
const cron = require('node-cron');
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
new CronStringStore().init();

app.post('/postTweetNow', async (req: Request, res: Response) => {
    if (!auth(req, res)) return;

    const {tweet} = req.body;
    if (!tweet) {
        res.send({success: false, error: "date or tweet invalid"});
        return;
    }

    const newTweet: ITweet = new Tweet(tweet.id, tweet.content);
    await autoTweetApi.TweetHandler(newTweet);

    res.send({success: true});
});

app.post("/scheduleTweet", async (req: Request, res: Response) => {
    if (!auth(req, res)) return;

    const {tweet} = req.body;
    if (!tweet) {
        res.send({success: false, error: "tweet invalid"});
        return;
    }

    const newTweet: ITweet = new Tweet(tweet.id, tweet.content);
    new TweetStore().addTweet(newTweet);
    console.log(newTweet);

    console.log(`Scheduling {${newTweet.content}}`);
    res.send({success: true});
});

app.get('/scheduledTweets', async (req: Request, res: Response) => {
    if (!auth(req, res)) return;

    const tweets: ITweet[] = new TweetStore().getTweets();
    res.send({tweets});
});

app.post('/addCronStrings', async (req: Request, res: Response) => {
   if (!auth(req, res)) return;

   const {cronStrings} = req.body;
   if (!cronStrings) return;

   console.log("Updated cron strings.")
   updateCronStrings(cronStrings);

   res.send({success: true});
});

function auth(req: Request, res: Response): boolean {
    const auth: string | undefined = req.get("authorization");

    if (typeof auth === "string") {
        const password = Buffer.from(<string>auth.split(' ')[1], "base64").toString("ascii").substr(1);

        if (password !== process.env.PASSWORD) {
            res.send({success: false, error: "wrong password"});
            return false;
        }
    } else {
        res.send({success: false, error: "wrong password"});
        return false;
    }

    return true;
}

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