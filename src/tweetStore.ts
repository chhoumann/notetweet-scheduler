import {ITweet} from "./ITweet";

const db = require('./db');

export class TweetStore {
    public init(): void {
        db.query("CREATE TABLE tweets (id text primary key, content text[]);");
    }

    public getTweets(): ITweet[] {
        return db.query("SELECT * from public.tweets;");
    }

    public addTweet(tweet: ITweet): void {
        db.query(`INSERT INTO public.tweets (id, content) values (${tweet.id}, {${tweet.content.join(', ')}});`);
    }

    public deleteTweet(tweetId: string): void {
        db.query(`DELETE FROM public.tweets WHERE id = ${tweetId}`);
    }

    public updateTweet(tweetId: string, newData: ITweet): ITweet {
        db.query(`UPDATE public.tweets SET content = ${newData.content.join(', ')} WHERE id = ${tweetId};`)
        return newData;
    }
}

