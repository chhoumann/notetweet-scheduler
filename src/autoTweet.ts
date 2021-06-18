const {TwitterClient} = require('twitter-api-client');
const { Router } = require('express');

const twitterClient = () => new TwitterClient({
            apiKey: process.env.API_KEY,
            apiSecret: process.env.API_SECRET,
            accessToken: process.env.ACCESS_TOKEN,
            accessTokenSecret: process.env.ACCESS_SECRET,
        });

async function TweetHandler(tweet: string) {
    console.log(process.env.API_KEY);
    console.log(process.env.API_SECRET);
    console.log(process.env.ACCESS_TOKEN);
    console.log(process.env.ACCESS_SECRET);
    try {
        const tweeted = await twitterClient().tweets.statusesUpdate(tweet);
        console.log(`Tweeted: ${tweet}`);
        return tweeted;
    } catch (error) {
        console.log(error);
    }
}


module.exports = {TweetHandler};