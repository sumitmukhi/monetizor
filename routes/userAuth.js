var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var nodemailer = require("nodemailer");
var authy = require('authy')('osW3qutgkjmuGuyk4OY1G8z85d7ZYNk9');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "noreply@chainwolf.com",
        pass: "chainwolfnoreply"
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
                        // html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                        html : '<!doctype html> <html> <head> <meta name="viewport" content="width=device-width" /> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <title>Monetizor Verification Email</title> <style> img {border: none; -ms-interpolation-mode: bicubic; max-width: 100%; } body {background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } table {border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; } table td {font-family: sans-serif; font-size: 14px; vertical-align: top; } .body {background-color: #f6f6f6; width: 100%; } .container {display: block; Margin: 0 auto !important; max-width: 580px; padding: 10px; width: 580px; } .content {box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; } .main {background: #ffffff; border-radius: 3px; width: 100%; } .wrapper {box-sizing: border-box; padding: 20px; } .content-block {padding-bottom: 10px; padding-top: 10px; } .footer {clear: both; Margin-top: 10px; text-align: center; width: 100%; } .footer td, .footer p, .footer span, .footer a {color: #999999; font-size: 12px; text-align: center; } h1, h2, h3, h4 {color: #000000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; Margin-bottom: 30px; } h1 {font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize; } p, ul, ol {font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px; } p li, ul li, ol li {list-style-position: inside; margin-left: 5px; } a {color: #3498db; text-decoration: underline; } .btn {box-sizing: border-box; width: 100%; } .btn>tbody>tr>td {padding-bottom: 15px; } .btn table {width: auto; } .btn table td {background-color: #ffffff; border-radius: 5px; text-align: center; } .btn a {background-color: #ffffff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; } .btn-primary table td {background-color: #3498db; } .btn-primary a {background-color: #3498db; border-color: #3498db; color: #ffffff; } .last {margin-bottom: 0; } .first {margin-top: 0; } .align-center {text-align: center; } .align-right {text-align: right; } .align-left {text-align: left; } .clear {clear: both; } .mt0 {margin-top: 0; } .mb0 {margin-bottom: 0; } .preheader {color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0; } .powered-by a {text-decoration: none; } hr {border: 0; border-bottom: 1px solid #f6f6f6; Margin: 20px 0; } @media only screen and (max-width: 620px) {table[class=body] h1 {font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a {font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article {padding: 10px !important; } table[class=body] .content {padding: 0 !important; } table[class=body] .container {padding: 0 !important; width: 100% !important; } table[class=body] .main {border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table {width: 100% !important; } table[class=body] .btn a {width: 100% !important; } table[class=body] .img-responsive {height: auto !important; max-width: 100% !important; width: auto !important; } } @media all {.ExternalClass {width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%; } .apple-link a {color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } .btn-primary table td:hover {background-color: #34495e !important; } .btn-primary a:hover {background-color: #34495e !important; border-color: #34495e !important; } } </style> </head> <body class=""> <table border="0" cellpadding="0" cellspacing="0" class="body"> <tr> <td>&nbsp;</td> <td class="container"> <div class="content"> <span class="preheader">Please click on the link to verify your email.</span> <table class="main"> <tr> <td class="wrapper"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td> <p>Hi there,</p> <p>Welcome to monetizor. Earn ethers by sharing rich content over your social network, share to spread the word with your connections. Please click on the link to verify your email.</p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary"> <tbody> <tr> <td align="left"> <table border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <a href='+ link +' target="_blank">Verify email</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p>Thanks for your the time you spend on monetizor.</p> <p>Good luck! Happy earning.</p> </td> </tr> </table> </td> </tr> </table> <div class="footer"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td class="content-block"> <span class="apple-link">Monetizor, Bangalore, IN</span> <br> Dont like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>. </td> </tr> <tr> <td class="content-block powered-by"> Powered by <a href="http://htmlemail.io">HTMLemail</a>. </td> </tr> </table> </div> </div> </td> <td>&nbsp;</td> </tr> </table> </body> </html>'
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
                        // html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                        html : '<!doctype html> <html> <head> <meta name="viewport" content="width=device-width" /> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <title>Monetizor Verification Email</title> <style> img {border: none; -ms-interpolation-mode: bicubic; max-width: 100%; } body {background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } table {border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; } table td {font-family: sans-serif; font-size: 14px; vertical-align: top; } .body {background-color: #f6f6f6; width: 100%; } .container {display: block; Margin: 0 auto !important; max-width: 580px; padding: 10px; width: 580px; } .content {box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; } .main {background: #ffffff; border-radius: 3px; width: 100%; } .wrapper {box-sizing: border-box; padding: 20px; } .content-block {padding-bottom: 10px; padding-top: 10px; } .footer {clear: both; Margin-top: 10px; text-align: center; width: 100%; } .footer td, .footer p, .footer span, .footer a {color: #999999; font-size: 12px; text-align: center; } h1, h2, h3, h4 {color: #000000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; Margin-bottom: 30px; } h1 {font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize; } p, ul, ol {font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px; } p li, ul li, ol li {list-style-position: inside; margin-left: 5px; } a {color: #3498db; text-decoration: underline; } .btn {box-sizing: border-box; width: 100%; } .btn>tbody>tr>td {padding-bottom: 15px; } .btn table {width: auto; } .btn table td {background-color: #ffffff; border-radius: 5px; text-align: center; } .btn a {background-color: #ffffff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; } .btn-primary table td {background-color: #3498db; } .btn-primary a {background-color: #3498db; border-color: #3498db; color: #ffffff; } .last {margin-bottom: 0; } .first {margin-top: 0; } .align-center {text-align: center; } .align-right {text-align: right; } .align-left {text-align: left; } .clear {clear: both; } .mt0 {margin-top: 0; } .mb0 {margin-bottom: 0; } .preheader {color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0; } .powered-by a {text-decoration: none; } hr {border: 0; border-bottom: 1px solid #f6f6f6; Margin: 20px 0; } @media only screen and (max-width: 620px) {table[class=body] h1 {font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a {font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article {padding: 10px !important; } table[class=body] .content {padding: 0 !important; } table[class=body] .container {padding: 0 !important; width: 100% !important; } table[class=body] .main {border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table {width: 100% !important; } table[class=body] .btn a {width: 100% !important; } table[class=body] .img-responsive {height: auto !important; max-width: 100% !important; width: auto !important; } } @media all {.ExternalClass {width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%; } .apple-link a {color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } .btn-primary table td:hover {background-color: #34495e !important; } .btn-primary a:hover {background-color: #34495e !important; border-color: #34495e !important; } } </style> </head> <body class=""> <table border="0" cellpadding="0" cellspacing="0" class="body"> <tr> <td>&nbsp;</td> <td class="container"> <div class="content"> <span class="preheader">Please click on the link to verify your email.</span> <table class="main"> <tr> <td class="wrapper"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td> <p>Hi there,</p> <p>Welcome to monetizor. Earn ethers by sharing rich content over your social network, share to spread the word with your connections. Please click on the link to verify your email.</p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary"> <tbody> <tr> <td align="left"> <table border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <a href='+ link +' target="_blank">Verify email</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p>Thanks for your the time you spend on monetizor.</p> <p>Good luck! Happy earning.</p> </td> </tr> </table> </td> </tr> </table> <div class="footer"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td class="content-block"> <span class="apple-link">Monetizor, Bangalore, IN</span> <br> Dont like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>. </td> </tr> <tr> <td class="content-block powered-by"> Powered by <a href="http://htmlemail.io">HTMLemail</a>. </td> </tr> </table> </div> </div> </td> <td>&nbsp;</td> </tr> </table> </body> </html>'
                    }
                    console.log(mailOptions);
                    smtpTransport.sendMail(mailOptions, function(error, response) {
                        if (error) {
                            console.log(error);
                            // res.end("error");
                        } else {
                            console.log("Message sent: " + response.message);
                            // res.end("sent");
                            authy.phones().verification_start(req.body.phone, '1', 'sms', function(err, resp) {
                                if (error) {
                                    console.log(err);
                                    // res.end("error");
                                } else {
                                    console.log("Verification code sent: " + resp);
                                    // res.end("sent");
                                    res.setHeader('Content-Type', 'application/json');
                                    res.status(200).send(JSON.stringify({ auth: true, token: token }, null, 3));
                                }
                            });
                        }
                    });
                    // end 

                });
        }

    });
});

router.put('/verify', function(req, res) {
    
    console.log(req.protocol + ":/" + req.get('host'));
    // if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        // console.log("Domain is matched. Information is from Authentic email");
        if (req.body.id == rand) {
            console.log(mailOptions.to+" is successfully verified.");
            // res.end("Email " + mailOptions.to + " is been Successfully verified");
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({ email: mailOptions.to, message: "Email is been Successfully verified" }));
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

router.put('/verify/phone', function(req, res) {
    
    authy.phones().verification_check(req.body.phone, '1', req.body.code, function (err, resp) {
        if(err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send(JSON.stringify(err));
        }
        else {
            console.log(resp);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(resp));
        }
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
                share_count: req.body.share_count,
                like_count: req.body.like_count,
                comment_count: req.body.comment_count
            }
        },
        function(err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.")
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(user));
        });
});

router.put('/update/count', function(req, res) {
    User.findOne({ _id: req.body.user_id }, function(err, user) {
        if (err) return res.status(500).send('Error on the server.');
        console.log(user);

        var total = req.body.share_count + req.body.like_count + req.body.comment_count;
        var totalBalance = total * 0.01;
        
        User.update({
                _id: req.body.user_id
            }, {
                $set: {
                    share_count: req.body.share_count.toString(),
                    like_count: req.body.like_count.toString(),
                    comment_count: req.body.comment_count.toString()
                }
            },
            function(err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.")
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(user));
            });
    });

});

router.put('/update/status', function(req, res) {

    User.update({
            email: req.body.email
        }, {
            $set: {
                status: req.body.status
            }
        },
        function(err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.")
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(user));
        });
});

router.put('/update/balance', function(req, res) {
        User.update({
                _id: req.body.user_id
            }, {
                $set: {
                    credited_count: req.body.credits.toString()
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