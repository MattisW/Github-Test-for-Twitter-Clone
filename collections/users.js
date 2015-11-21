Users = Meteor.users;

Schema = {};

Schema.UserSchema = new SimpleSchema({
    username: {
        type: String,
        label: "Username",
        max: 200
    },
    "profile.description": {
        type: String,
        label: "Descrption",
        optional: true
    },
    "profile.image": {
        type: String,
        autoform: {
            atFieldInput: {
                type: 'fileUpload',
                collection: 'Images'
            }
        },
        label: "Datei hochladen",
        optional: true
    }
});

Meteor.users.attachSchema(Schema.UserSchema);

Meteor.methods({
    follow: function(followId) {
        Users.update(this.userId, {
            $push: {
                "profile.followingIds": followId
            }
        });
    },
    unfollow: function(followId) {
        Users.update(this.userId, {
            $pull: {
                "profile.followingIds": followId
            }
        })
    }
});

Users.helpers({
    profileImage: function() {
        return "/cfs/files/images" + this.profile.image;
    }
});

Meteor.users.allow({
    update: function() {
        return true;
    },
    insert: function() {
        return true;
    }
});
