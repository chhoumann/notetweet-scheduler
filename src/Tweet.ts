import {ITweet} from "./ITweet";

export class Tweet implements ITweet {
    id: string;
    posted: boolean;
    content: string[];

    constructor(id: string, tweet: string[]) {
        this.id = id;
        this.content = tweet;
        this.posted = false;
    }
}