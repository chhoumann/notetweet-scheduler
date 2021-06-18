import {ITweet} from "./ITweet";

export class Tweet implements ITweet {
    ID: string;
    posted: boolean;
    scheduledFor: Date;
    content: string[];

    constructor(id: string, tweet: string[], date: Date) {
        this.ID = id;
        this.content = tweet;
        this.posted = false;
        this.scheduledFor = date;
    }
}