import {ITweet} from "./ITweet";

export class Tweet implements ITweet {
    id: string;
    content: string[];
    postat: Date;

    constructor(id: string, tweet: string[], postat: Date) {
        this.id = id;
        this.content = tweet;
        this.postat = postat;
    }

}