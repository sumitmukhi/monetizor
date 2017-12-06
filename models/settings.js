var restful = require('node-restful');
var mongoose = restful.mongoose;

var settingSchema = new mongoose.Schema({
    page_access_token: {
        type: String,
        default: ''
    },
    app_name: {
        type: String,
        default: ''
    },
    app_id: {
        type: String,
        default: ''
    }
});

module.exports = restful.model('Settings', settingSchema);