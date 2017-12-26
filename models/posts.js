// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;



// Schema
var postSchema = new mongoose.Schema({
	title: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    fb_share_id: {
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
    },
    cost_per_share: {
        type: String,
        default: ''
    },
    cost_per_like: {
        type: String,
        default: ''
    },
    cost_per_comment: {
        type: String,
        default: ''
    },
    budget: {
        type: String,
        default: ''
    },
    cost_per_like: {
        type: String,
        default: ''
    },
    created_by_id: {
        type: String,
        default: ''
    },
    timestamps: {} 
});

// Return Model
module.exports = restful.model('Posts', postSchema);