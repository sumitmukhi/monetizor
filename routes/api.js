// Dependencies
var express = require('express');
var router = express.Router();

// Models
var Post = require('../models/posts.js');
var Setting = require('../models/settings.js');
var Share = require('../models/shares.js');
var Tag = require('../models/tags.js');

// Routes
// router.get('/products', function(req, res) {
// 	res.send('api is working');
// })

Post.methods(['get', 'put', 'post', 'delete']);
Post.register(router, '/post');

Setting.methods(['get', 'put', 'post', 'delete']);
Setting.register(router, '/setting');

Share.methods(['get', 'put', 'post', 'delete']);
Share.register(router, '/share');

Tag.methods(['get', 'put', 'post', 'delete']);
Tag.register(router, '/tag');


// Retun Router
module.exports = router;