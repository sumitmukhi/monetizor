var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "sumit@tranzita.com",
        pass: "9964947700"
    }
});
var rand, mailOptions, host, link;


var User = require('../models/users.js');
var VerifyToken = require('./verifyToken');


router.get('/all', function(req, res) {
    User.find({},
        function(err, user) {
            if (err) return res.status(500).send("Couldn't find any users.")

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(user));
        });
});


router.post('/register', function(req, res) {

    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) return res.status(500).send('Error on the server.');

        if (user) return res.status(401).send('User already exists');

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        if (req.body.company) {
            User.create({
                    handle: req.body.handle,
                    email: req.body.email,
                    company: req.body.company,
                    vertical: req.body.vertical,
                    password: hashedPassword,
                    type: '1',
                    status: '0'
                },
                function(err, user) {
                    if (err) return res.status(500).send("There was a problem registering the user.")
                    // create a token
                    var token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    // send verification email
                    rand = Math.floor((Math.random() * 100) + 54);
                    host = req.get('host');
                    link = "http://" + req.get('host') + "/verify/email?id=" + rand;
                    mailOptions = {
                        to: req.body.email,
                        subject: "Please confirm your Email account",
                        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                    }
                    console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response) {
                        if (error) {
                            console.log(error);
                            res.end("error");
                        } else {
                            console.log("Message sent: " + response.message);
                            res.end("sent");
                        }
                    });
                    // end 

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).send(JSON.stringify({ auth: true, token: token }, null, 3));
                });
        } else {
            User.create({
                    handle: req.body.handle,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashedPassword,
                    type: '0',
                    status: '0'
                },
                function(err, user) {
                    if (err) return res.status(500).send("There was a problem registering the user.")
                    // create a token
                    var token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    // send verification email
                    rand = Math.floor((Math.random() * 100) + 54);
                    host = req.get('host');
                    link = "http://" + req.get('host') + "/verify/email?id=" + rand;
                    mailOptions = {
                        to: req.body.email,
                        subject: "Please confirm your Email account",
                        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                    }
                    console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response) {
                        if (error) {
                            console.log(error);
                            res.end("error");
                        } else {
                            console.log("Message sent: " + response.message);
                            res.end("sent");
                        }
                    });
                    // end 

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).send(JSON.stringify({ auth: true, token: token }, null, 3));
                });
        }

    });
});

router.put('/verify', function(req, res) {
    
    console.log(req.protocol + ":/" + req.get('host'));
    // if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        // console.log("Domain is matched. Information is from Authentic email");
        if (req.body.id == rand) {
            console.log("email is verified");
            // res.end("Email " + mailOptions.to + " is been Successfully verified");
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({ message: "Email is been Successfully verified" }));
        } else {
            console.log("email is not verified");
            // res.end("<h1>Bad Request</h1>");
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send(JSON.stringify({ error: "Bad Request" }));
        }
    // } 
    // else {
    //     // res.end("<h1>Request is from unknown source<h1>");
    //     res.setHeader('Content-Type', 'application/json');
    //     res.status(400).send(JSON.stringify({ error: "Request is from unknown source" }));
    // }

});

router.put('/update', function(req, res) {

    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) return res.status(500).send('Error on the server.');

        User.update({
                _id: req.body.user_id
            }, {
                $set: {
                    fb_id: req.body.fb_id,
                    name: req.body.name,
                    image: req.body.image,
                    fb_profile_url: req.body.fb_profile_url,
                    fb_access_token: req.body.fb_access_token
                }
            },
            function(err, user) {
                if (err) return res.status(500).send("There was a problem registering the user.")
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(user));
            });
    });
});

router.put('/update/share', function(req, res) {

    User.update({
            _id: req.body.user_id
        }, {
            $set: {
                share_count: req.body.share_count
            }
        },
        function(err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.")
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(user));
        });
});

// router.get('/me', function(req, res) {
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//     jwt.verify(token, config.secret, function(err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

//         // Decoded token response
//         // res.status(200).send(decoded);


//         // Response with hashed password
//         // User.findById(decoded.id, function(err, user) {
//         //     if (err) return res.status(500).send("There was a problem finding the user.");
//         //     if (!user) return res.status(404).send("No user found.");

//         //     res.status(200).send(user);
//         // });

//         // Response with omitted password
//         User.findById(decoded.id, { password: 0 }, // projection
//             function(err, user) {
//                 if (err) return res.status(500).send("There was a problem finding the user.");
//                 if (!user) return res.status(404).send("No user found.");
//                 // res.status(200).send(user);  // (approach 1)
//                 next(user); // (approach 2)
//             });


//     });
// });

router.get('/me', VerifyToken, function(req, res, next) {
    User.findById(req.userId, { password: 0 }, function(err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
    });
});

// add the middleware function
router.use(function(user, req, res, next) {
    res.status(200).send(user);
});

router.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) return res.status(500).send('Error on the server.');

        if (!user) return res.status(404).send('No user found.');

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
});

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;