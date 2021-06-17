const {TwitterClient} = require('twitter-api-client');
const { Router } = require('express');
const router = Router();

const twitterClient = new TwitterClient({
            apiKey: process.env.API_KEY,
            apiSecret: process.env.API_SECRET,
            accessToken: process.env.ACCESS_TOKEN,
            accessTokenSecret: process.env.ACCESS_SECRET,
        });

router.post('/postTweet', async (req, res) => {
    try {
        const tweet = req.body;
        await TweetHandler(tweet);
    } catch (error) {
        next(error);
    }
    res.end();
});

async function TweetHandler(tweet){
    try {
        await twitterClient.tweets.statusesUpdate(tweet);
    } catch (error) {
        console.log(error);
    }
}


module.exports = {router};