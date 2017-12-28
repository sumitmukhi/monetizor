var restful = require('node-restful');
var mongoose = restful.mongoose;

var shareSchema = new mongoose.Schema({
    fb_post_id: {
        type: String,
        default: ''
    },
    fb_user_id: {
        type: String,
        default: ''
    },
    post_id: {
        type: String,
        default: ''
    },
    user_id: {
        type: String,
        default: ''
    },
    share_count: {
        type: String,
        default: ''
    },
    like_count: {
        type: String,
        default: ''
    },
    comment_count: {
        type: String,
        default: ''
    }
});

module.exports = restful.model('Shares', shareSchema);