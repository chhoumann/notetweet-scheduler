import {ITweet} from "./ITweet";

export class Tweet implements ITweet {
    ID: string;
    posted: boolean;
    content: string[];

    constructor(id: string, tweet: string[]) {
        this.ID = id;
        this.content = tweet;
        this.posted = false;
    }
}