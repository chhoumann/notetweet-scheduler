import {TwitterClient} from "twitter-api-client";


const twitterClient = async () => new TwitterClient({// @ts-ignore
    apiKey: process.env.API_KEY,// @ts-ignore
    apiSecret: process.env.API_SECRET,// @ts-ignore
    accessToken: process.env.ACCESS_TOKEN,// @ts-ignore
    accessTokenSecret: process.env.ACCESS_SECRET,
});

async function TweetHandler(tweet: string) {
    try {
        const client: TwitterClient = await twitterClient();
        const statusesUpdate = await client.tweets.statusesUpdate({status: tweet});
        console.log(`Tweeted: ${tweet}`);
        return statusesUpdate;
    } catch (error) {
        console.log(error);
    }
}


module.exports = {TweetHandler};