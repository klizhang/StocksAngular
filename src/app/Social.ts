import { SocialReddit } from "./Social-Reddit";
import { SocialTwitter } from "./Social-Twitter";
export interface Social {
    reddit: SocialReddit[];
    symbol: string;
    twitter: SocialTwitter[];
}
    