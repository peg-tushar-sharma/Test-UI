import { BucketColumnPreference } from "./bucket-column-preference";
import { BucketGroup } from "./bucketGroup";

export class UserPreference {
    bucketGroup: BucketGroup[];
    region: any;
    bucketColumn:BucketColumnPreference[];
}