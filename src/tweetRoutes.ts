import {TweetStore} from "./tweetStore";
import {ITweet} from "./ITweet";
import {Request, Response} from "express";
import {Tweet} from "./Tweet";

const Router = require('express-promise-router');
const autoTweetApi = require('./autoTweet.js');

const router = new Router();
module.exports = router;

router.post('/postTweetNow', async (req: Request, res: Response) => {
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

router.post("/scheduleTweet", async (req: Request, res: Response) => {
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

router.get('/scheduledTweets', async (req: Request, res: Response) => {
    if (!auth(req, res)) return;

    const tweets: ITweet[] = await new TweetStore().getTweets();
    res.send(tweets);
});

router.delete('/deleteScheduled', async (req: Request, res: Response) => {
    if (!auth(req, res)) return;
    const {tweet} = req.body;

    await new TweetStore().deleteTweet(tweet.id);
    res.send({success: true});
});

router.post('/addCronStrings', async (req: Request, res: Response) => {
    if (!auth(req, res)) return;

    const {cronStrings} = req.body;
    if (!cronStrings) return;

    console.log("Updated cron strings.")
    //updateCronStrings(cronStrings);

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
