// Dependencies
var express = require('express');
var mongoose  = require('mongoose');
var bodyParser = require('body-parser');


// MongoDB 
mongoose.connect('mongodb://localhost/monetizor');

// Express 
var app = express();
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// Routes
// app.get('/', function(req, res) {
// 	res.send('working');
// });

app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/userAuth'));


// Server
app.listen(3000);
console.log('API is running on port 3000');