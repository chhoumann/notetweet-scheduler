const TwitterClient = require('twitter-api-client');
const { Router } = require('express');
const router = Router();

const twitterClient = new TwitterClient({
            apiKey: process.env.twitterAPIKey,
            apiSecret: process.env.twitterAPISecret,
            accessToken: process.env.twitterAccessToken,
            accessTokenSecret: process.env.twitterAccessTokenSecret,
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