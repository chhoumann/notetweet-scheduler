import {TwitterClient} from "twitter-api-client";


const twitterClient = async () => new TwitterClient({// @ts-ignore
    apiKey: process.env.API_KEY,// @ts-ignore
    apiSecret: process.env.API_SECRET,// @ts-ignore
    accessToken: process.env.ACCESS_TOKEN,// @ts-ignore
    accessTokenSecret: process.env.ACCESS_SECRET,
});

async function TweetHandler(tweet: string) {
    console.log(process.env.API_KEY);
    console.log(process.env.API_SECRET);
    console.log(process.env.ACCESS_TOKEN);
    console.log(process.env.ACCESS_SECRET);
    try {
        const client: TwitterClient = await twitterClient();
        const res = await client.tweets.statusesUpdate({status: tweet});
        console.log(`Tweeted: ${tweet}`);
        return res;
    } catch (error) {
        console.log(error);
    }
}


module.exports = {TweetHandler};