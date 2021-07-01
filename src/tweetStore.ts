import {ITweet} from "./ITweet";

const db = require('./db');

export class TweetStore {
    public async init(): Promise<void> {
        await db.query("CREATE TABLE tweets(id text primary key, content text[], postOn timestamp);");
    }

    public async getTweets(): Promise<ITweet[]> {
        return await db.query("SELECT * from public.tweets;");
    }

    public async addTweet(tweet: ITweet, postAt: number): Promise<void> {
        await db.query(`INSERT INTO public.tweets(id, content, postat) values ($1, $2, to_timestamp($3 / 1000.0));`, [tweet.id, tweet.content, postAt]);
    }

    public async deleteTweet(tweetId: string): Promise<void> {
        await db.query(`DELETE FROM public.tweets WHERE id = $1`, [tweetId]);
    }

    public async updateTweet(tweetId: string, newData: ITweet): Promise<ITweet> {
        console.log("Trying to update.", newData);
        
        await db.query(`UPDATE public.tweets SET content = $1, poston = $2 WHERE id = $3;`, [newData.content, newData.postat, tweetId])
        return newData;
    }
}

