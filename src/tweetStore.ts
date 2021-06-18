import {ITweet} from "./ITweet";
import fs from 'fs';

export class TweetStore {
    private readonly file: string = "tweets.json";

    public getTweets(): ITweet[] {
        const data = fs.readFileSync(this.file)
        return JSON.parse(data.toString());

    }

    public writeTweets(tweets: ITweet[]): void {
        const data = JSON.stringify(tweets);
        fs.writeFileSync(this.file, data);
    }

    public addTweet(tweet: ITweet): void {
        const tweets: ITweet[] = this.getTweets();
        if (!tweets) return;

        tweets.push(tweet);
        this.writeTweets(tweets);
    }

    public deleteTweet(tweetId: string): void {
        let tweets: ITweet[] = this.getTweets();
        if (!tweets) return;

        tweets = tweets.filter(tweet => tweet.ID !== tweetId);
        this.writeTweets(tweets);
    }

    public updateTweet(tweetId: string, newData: ITweet): ITweet {
        const tweets: ITweet[] = this.getTweets();
        let targetTweet: ITweet | undefined = tweets.find(tweet => tweet.ID === tweetId);
        if (!targetTweet) throw new Error(`Tweet with ID: ${tweetId} not found.`);

        targetTweet = {...targetTweet, ...newData};
        const newTweets = tweets.map(tweet => {
            if (tweet.ID === targetTweet?.ID) return targetTweet;
            return tweet;
        });

        this.writeTweets(newTweets);
        return targetTweet;
    }
}

