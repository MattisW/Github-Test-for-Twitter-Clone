Router.configure({
    layoutTemplate: 'base',
    loadingTemplate: 'loading'
});

Router.map(function() {
    this.route('tweetStream', {
        path: '/',
        waitOn: function() {
            Meteor.subscribe("myTweets");
        },
        data: function() {
            return {
                user: Meteor.users.findOne(Meteor.userId())
            };
        }
    });
    this.route('notifications', {
        path: '/notifications',
        waitOn: function() {
            Meteor.subscribe("mentions");
        },
        data: function() {
            // we can subscribe to al tweets here since they are filtered right in the publication itself!
            tweets: Tweets.find();
            users: Meteor.users.find();
            return {
                user: Meteor.users.findOne(Meteor.userId())
            };
        }
    });
    this.route('profileEdit', {
        path: '/profile/edit',
        waitOn: function() {
            return Meteor.subscribe('images');
        }
    });
    this.route('profile', {
        path: '/:username',
        waitOn: function() {
            return [
                Meteor.subscribe("profile", this.params.username),
                Meteor.subscribe("profileTweets", this.params.username),
                Meteor.subscribe("images")
            ];
        },
        data: function() {
            return {
                user: Meteor.users.findOne({
                    username: this.params.username
                }),
                tweets: Tweets.find()
            };
        }
    });
});
