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
    credited_count: {
        type: String,
        default: '0'
    },
    wallet_address: {
        type: String,
        default: '0'
    }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');