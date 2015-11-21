Tweets = new Mongo.Collection("tweets");

processTweets = function(text) {
    if (Meteor.isServer) {
        // if no Ids are found, return an empty array
        var ids = [];
        // check if the incoming tweet contains @
        if (_.contains(text, "@")) {
            // if it does, split the entire tweet at each space and return the one containing @
            mentions = _.select(text.split(" "), function(string) {
                return _.contains(string, "@");
            });
            // select the username out of the mention by neglecting the first character (@)
            usernames = _.map(mentions, function(mention) {
                return mention.substring(1);
            });
            // find the users whose username is the mentioned username and return their userdocument
            users = Users.find({
                username: {
                    $in: usernames
                }
            }).fetch();
            // out of the mentioned user documents, just return the ids
            ids = _.pluck(users, "_id");
        }
    }
    return ids;
};

linkedText = function(text) {
    if(Meteor.isServer){
        if (_.contains(text, "@")){
            // if it does, split the entire tweet at each space and return the one containing @
            mentions = _.filter(text.split(" "), function(string) {
                return _.contains(string, "@");
            });
            console.log(mentions);
            // loop over each mention and transform it into the adequate link text
            _.each(mentions, function(mention) {
                text = text.replace(mention, '<a href="/' + mention.substring(1) + '">' + mention + '</a>');
            });
        };
        return text;
    }
};

Tweets.before.insert(function(userId, doc) {
    doc.tweetedAt = new Date();
    doc.userId = userId;
    doc.mentionIds = processTweets(doc.text);
    doc.linkedText = linkedText(doc.text);
});

Tweets.helpers({
    user: function() {
        return Meteor.users.findOne({
            _id: this.userId
        });
    },
    fullName: function() {
        if (this.user() && this.user().profile) {
            return this.user().profile.name;
        }
    },
    userName: function() {
        if (this.user()) {
            return this.user().username;
        }
    }
});

Tweets.allow({
    insert: function(userId, doc) {
        return userId;
    },
    update: function(userId, doc) {
        return false;
    },
    remove: function(userId, doc) {
        return doc.userId === userId;
    }
});
