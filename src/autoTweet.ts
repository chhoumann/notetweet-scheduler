const {TwitterClient} = require('twitter-api-client');

// @ts-ignore
const twitterClient = () => new TwitterClient({// @ts-ignore
            apiKey: process.env.API_KEY.trim(), // @ts-ignore
            apiSecret: process.env.API_SECRET.trim(),// @ts-ignore
            accessToken: process.env.ACCESS_TOKEN.trim(),// @ts-ignore
            accessTokenSecret: process.env.ACCESS_SECRET.trim(),
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