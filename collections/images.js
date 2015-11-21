/*Images = new FS.Collection('images', {
  stores: [new FS.Store.GridFS('images', {})]
});
*/
Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {})]
});


Images.allow({
  insert: function(userId, doc) {
    return userId;
  },
  download: function (userId) {
    return true;
  }
});

/*
Images.attachSchema(new SimpleSchema({
  image: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'cloudinary'
      }
    }
  }
}));
*/
