Template.tweet.helpers({
    tweets: function() {
        return Tweets.find({ tweetedAt: {$lt: Session.get('lastSeenTweets')}}, {sort: {tweetedAt: -1}});
    },
    tweetTime: function() {
        return moment(this.tweetedAt).fromNow();
        // time = this.tweetedAt - new Date();
        // return moment().startOf(time).fromNow();
    },
    tweetText: function () {
        if (this.linkedText){
            return Spacebars.SafeString(this.linkedText);
        } else {
            return this.text;
        }
    }
});
