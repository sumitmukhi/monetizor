var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');


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

        User.create({
                handle: req.body.handle,
                email: req.body.email,
                password: hashedPassword
            },
            function(err, user) {
                if (err) return res.status(500).send("There was a problem registering the user.")
                // create a token
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify({ auth: true, token: token }, null, 3));
            });
    });
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