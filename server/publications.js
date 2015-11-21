Meteor.publish("myTweets", function() {
    var userId      = this.userId,
        currentUser = Users.find({_id: userId});

    if (currentUser.fetch()[0] !== undefined) {
        var userCursor = Users.find({
            _id: this.userId
        });
        var user = userCursor.fetch()[0];
        var cursors = [];
        var ids = [];
        var self = this;

        // grab followingIds
        ids.push(user.profile.followingIds);
        // push own userId
        ids.push(self.userId);
        // flatten followingIds
        followingIds = _.flatten(ids);
        // push all Tweets from People I follow into the cursors
        cursors.push(Tweets.find({
            userId: {
                $in: followingIds
            }
        }));
        // push all the people I follow into the cursor
        cursors.push(Users.find({
            _id: {
                $in: followingIds
            }
        }, {
            fields: {
                username: 1,
                "profile.name": 1
            }
        }));

        userCursor.observeChanges({
            changed: function(id, user) {
                ids = user.profile.followingIds;
                ids.push(self.userId);
                console.log('THIS CHANGED-THE FOLLOWING IDS ARE NOW: ' + followingIds);
                flatIds = _.flatten(ids);
                addedFollowingIds = _.difference(flatIds, followingIds);
                removeFollowingIds = _.difference(followingIds, flatIds);
                followingIds = flatIds;
                console.log('THIS Is THE VALUE TAKEN FROM flatIds: ' + followingIds);
                // console.log(removeFollowingIds);
                if (addedFollowingIds) {
                    users = Users.find({
                        _id: {
                            $in: addedFollowingIds
                        }
                    }, {
                        fields: {
                            username: 1,
                            "profile.name": 1
                        }
                    });
                    _.each(users.fetch(), function(user) {
                        //console.log('ADDED A USER TO FOLLOWER: ' + user.username);
                        console.log('This many users before: ' + users.count());
                        self.added('users', user._id, user);
                        console.log('How many users are we now subscribed to: ' + users.count());
                        tweets = Tweets.find({
                            userId: user._id
                        });
                        tweets.forEach(function(tweet) {
                            //console.log('ADDED the following tweet: ' + tweet.text);
                            self.added('tweets', tweet._id, tweet);
                        });
                    });
                }
                if (removeFollowingIds) {
                    users = Users.find({
                        _id: {
                            $in: removeFollowingIds
                        }
                    }, {
                        fields: {
                            username: 1,
                            "profile.name": 1
                        }
                    });
                    _.each(users.fetch(), function(user) {
                        // console.log('REMOVED THE FOLLOWING USER: ' + user.username);
                        self.removed('users', user._id);
                        tweets = Tweets.find({
                            userId: user._id
                        });
                        tweets.forEach(function(tweet) {
                            // console.log('REMOVED THE FOLLOWING TWEETS: ' + tweet.text);
                            self.removed('tweets', tweet._id);
                        });
                    });
                }
            }
        });
        return cursors;
    } else {
        console.log('NEED TO LOGIN FIRST!');
        return this.ready();
    }
});

Meteor.publish("profile", function(username) {
    return Users.find({
        username: username
    }, {
        fields: {
            emails: 0,
            services: 0
        }
    });
});

Meteor.publish("mentions", function() {
    // return curser containing all tweets that mention me
    tweetsCursor = Tweets.find({
        mentionIds: {
            $in: [this.userId]
        }
    });
    // from the array of tweets that mention me, pluck all the userIds (i.e. who mentioned me)
    userIds = _.pluck(tweetsCursor.fetch(), "userId");
    // test cursor
    testQuery = Users.find({
        _id: {
            $in: userIds
        }
    });
    // return cursor of all users who mentioned me and only publish their basic details
    userCursor = Users.find({
        _id: {
            $in: userIds
        }
    }, {
        fields: {
            "username": 1,
            "profile.name": 1
        }
    });
    console.log(userIds);
    // we need to return both the Tweets + the UserIds (to display names on each tweet)
    return [userCursor, tweetsCursor];
});

Meteor.publish("profileTweets", function(username) {
    user = Users.findOne({
        username: username
    }, {
        fields: {
            emails: 0,
            services: 0
        }
    });
    return Tweets.find({
        userId: user._id
    });
});

Meteor.publish("usernames", function(selector, options, colName) {
    self = this;
    _.extend(options, {
        fields: {
            username: 1
        }
    });
    console.log(selector);
    console.log(options);
    usersCursor = Users.find(selector, options).observeChanges({
        added: function(id, fields) {
            self.added('autocompleteRecords', id, fields);
        },
        changed: function(id, fields) {
            self.changed('autocompleteRecords', id, fields);
        },
        remove: function(id) {
            self.removed('autocompleteRecords', id);
        }
    });
    self.ready();
    self.onStop(function() {
        usersCursor.stop();
    });
});
