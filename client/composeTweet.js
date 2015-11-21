Template.composeTweet.events({
    "submit .tweetSubmit": function(event, template) {
        event.preventDefault();
        text = template.$('.tweetSubmit .form-control').val();
        Tweets.insert({
            text: text
        }, function(err, res) {
            if (res) {
                sAlert.success("Your tweet has been added.");
                template.$('.tweetSubmit .form-control').val(null);
            } else {
                sAlert.warning("There was a problem adding your tweet.");
                console.log(err);
            }
        });
    }
});

Template.composeTweet.helpers({
    settings: function() {
        return {
            position: "bottom",
            limit: 5,
            rules: [{
                token: "@",
                collection: "Users",
                field: "username",
                subscription: "usernames",
                matchAll: true,
                template: Template.userPill
            }]
        };
    }
});
