var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    handle: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    vertical: {
        type: String,
        default: ''
    },
    company: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    fb_id: {
        type: String,
        default: ''
    },
    fb_profile_url: {
        type: String,
        default: ''
    },
    fb_access_token: {
    	type: String,
    	default: ''
    },
    share_count: {
        type: String,
        default: '0'
    },
    like_count: {
        type: String,
        default: ''
    },
    comment_count: {
        type: String,
        default: ''
    },
    credited_count: {
        type: String,
        default: '0'
    },
    wallet_address: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: '0' // 0: user, 1: client, 2: admin
    },
    status: {
        type: String,
        default: '0' // 0: unverified, 1 verified
    }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');