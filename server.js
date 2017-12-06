// Dependencies
var express = require('express');
var mongoose  = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var nconf = require('nconf');
const PORT = process.env.PORT || 3000


// MongoDB 
// mongoose.connect('mongodb://localhost/monetizor');
mongoose.connect('mongodb://admin:sumit1992*@ds119436.mlab.com:19436/sandbox');

// Express 
var app = express();
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride('X-HTTP-Method-Override'));

// Routes
// app.get('/', function(req, res) {
// 	res.send('working');
// });

app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/userAuth'));



app.use(express.static('./public2'));
app.use(morgan('dev'));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public2/index.html');
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

// Server
// app.listen(3000);
// console.log('API is running on port 3000');