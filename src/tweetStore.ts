import {ITweet} from "./ITweet";

const db = require('./db');

export class TweetStore {
    public async init(): Promise<void> {
        await db.query("CREATE TABLE tweets (id text primary key, content text[]);");
    }

    public async getTweets(): Promise<ITweet[]> {
        return await db.query("SELECT * from public.tweets;");
    }

    public async addTweet(tweet: ITweet): Promise<void> {
        await db.query(`INSERT INTO public.tweets(id, content) values ($1, $2);`, [tweet.id, tweet.content]);
    }

    public async deleteTweet(tweetId: string): Promise<void> {
        await db.query(`DELETE FROM public.tweets WHERE id = ${tweetId}`);
    }

    public async updateTweet(tweetId: string, newData: ITweet): Promise<ITweet> {
        await db.query(`UPDATE public.tweets SET content = ${newData.content.join(', ')} WHERE id = ${tweetId};`)
        return newData;
    }
}

