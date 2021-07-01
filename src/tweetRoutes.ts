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

    const newTweet: ITweet = new Tweet(tweet.id, tweet.content, new Date(Date.now()));
    await autoTweetApi.TweetHandler(newTweet);

    res.send({success: true});
});

router.post("/scheduleTweet", async (req: Request, res: Response) => {
    if (!auth(req, res)) return;

    const {tweet, postAt} = req.body;
    if (!tweet) {
        res.send({success: false, error: "tweet invalid"});
        return;
    }

    const newTweet: ITweet = new Tweet(tweet.id, tweet.content, new Date(postAt));
    await new TweetStore().addTweet(newTweet, postAt);

    console.log(`Scheduling {${newTweet.content}}`);
    res.send({success: true});
});

router.get('/scheduledTweets', async (req: Request, res: Response) => {
    if (!auth(req, res)) return;

    const result: any = await new TweetStore().getTweets();
    res.send(result.rows);
});

router.delete('/deleteScheduled', async (req: Request, res: Response) => {
    if (!auth(req, res)) return;
    const {tweet} = req.body;

    await new TweetStore().deleteTweet(tweet.id);
    res.send({success: true});
});

router.post('/updateTweet', async (req: Request, res: Response) => {
    if (!auth(req, res)) return;
    console.log(1);
    

    const {tweet, postAt} = req.body;
    console.log(2);
    
    if (!tweet) {
        res.send({success: false, error: "tweet invalid"});
        return;
    }
    console.log(3);
    

    const newTweet: ITweet = new Tweet(tweet.id, tweet.content, new Date(postAt));
    console.log(4, newTweet);
    
    await new TweetStore().updateTweet(newTweet.id, newTweet);
    console.log(5);
    
    console.log(`Updated Tweet {${newTweet.id}}`);
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
