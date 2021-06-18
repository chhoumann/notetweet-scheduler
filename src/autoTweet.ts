import {StatusesUpdate, TwitterClient} from "twitter-api-client";
import {ITweet} from "./ITweet";


const twitterClient = async () => new TwitterClient({// @ts-ignore
    apiKey: process.env.API_KEY,// @ts-ignore
    apiSecret: process.env.API_SECRET,// @ts-ignore
    accessToken: process.env.ACCESS_TOKEN,// @ts-ignore
    accessTokenSecret: process.env.ACCESS_SECRET,
});

async function TweetHandler(tweet: ITweet) {
    console.log("TweetHandler...")
    try {
        const postedTweets = await postTweet(tweet);

        console.log(`Tweeted: ${tweet}`);

        return postedTweets;
    } catch (error) {
        console.log(error);
    }
}

async function postTweet(tweet: ITweet) {
    const client: TwitterClient = await twitterClient();
    let postedTweets: StatusesUpdate[] = [];
    let previousPost: StatusesUpdate;

    for (const status of tweet.content) {
        // @ts-ignore
        if (!previousPost) {
          previousPost = await client.tweets.statusesUpdate({status: status.trim()});
      } else {
          previousPost = await client.tweets.statusesUpdate({
              status: status.trim(),
              in_reply_to_status_id: previousPost.id_str,
          });
      }

      postedTweets.push(previousPost);
    }

    return postedTweets;
  }


module.exports = {TweetHandler};