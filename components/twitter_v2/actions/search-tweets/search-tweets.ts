import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getTweetFields } from "../../common/methods";
import { tweetFieldProps } from "../../common/propGroups";
import { SearchTweetsParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent";
const MIN_RESULTS = 10;
const DEFAULT_RESULTS = 10;
const MAX_RESULTS_PER_PAGE = 100;

export default defineAction({
  key: "twitter_v2-search-tweets",
  name: "Search Tweets",
  description: `Retrieve Tweets from the last seven days that match a query. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "One query for matching Tweets. See the [Twitter API guide on building queries](https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query).",
    },
    ...tweetFieldProps,
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
      min: MIN_RESULTS,
      max: MAX_RESULTS_PER_PAGE * 5,
      default: DEFAULT_RESULTS,
    },
  },
  methods: {
    getTweetFields,
  },
  async run({ $ }): Promise<object> {
    const params: SearchTweetsParams = {
      $,
      params: {
        query: this.query,
      },
      maxPerPage: MAX_RESULTS_PER_PAGE,
      maxResults: this.maxResults,
    };

    const response = await this.app.searchTweets(params);
    const { length } = response;

    const summary = length
      ? `Successfully retrieved ${length} tweet${length === 1
        ? ""
        : "s"}`
      : "No tweets found";
    $.export("$summary", summary);

    return response;
  },
});
