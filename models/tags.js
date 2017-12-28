var restful = require('node-restful');
var mongoose = restful.mongoose;

var tagSchema = new mongoose.Schema({
    fb_tag_id: {
        type: String,
        default: ''
    },
    fb_tag_time: {
        type: String,
        default: ''
    }

});

module.exports = restful.model('Tags', tagSchema);