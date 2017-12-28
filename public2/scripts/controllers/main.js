angular.module('homeController', [])

    .controller('initController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$cookies', '$cookieStore', 'User', 'Post', 'Share', 'Tag', '$timeout',
        function($scope, $rootScope, $http, $state, $stateParams, $cookies, $cookieStore, User, Post, Share, Tag, $timeout) {
            
            if($state.current.name = "login"){
                $scope.mainClass = "page-login";
            }
            else if($state.current.name = "register"){
                $scope.mainClass = "page-register"
            }
            else{
                $scope.mainClass = "page-header-fixed compact-menu page-horizontal-bar";
            }

        }
    ])

    .controller('mainController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$cookies', '$cookieStore', 'User', 'Post', 'Share', 'Tag', '$timeout',
        function($scope, $rootScope, $http, $state, $stateParams, $cookies, $cookieStore, User, Post, Share, Tag, $timeout) {
            
            $scope.formData = {};
            $scope.postData = {};

            $scope.loggedInUser = {};
            // $scope.userId = $cookies._id;
            // $scope.userName = $cookies.handle;
            // $scope.userEmail = $cookies.email;

            $scope.loggedInUser.handle = $cookies.handle;
            $scope.loggedInUser.name = $cookies.name;
            $scope.loggedInUser.email = $cookies.email;
            $scope.loggedInUser.fbUserId = $cookies.fbUserId;
            $scope.loggedInUser.id = $cookies._id;
            $scope.loggedInUser.type = $cookies.type;

            if( $cookies.image){
                $scope.loggedInUser.image = $cookies.image;
            }
            else{
                $scope.loggedInUser.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Creative-Tail-People-boy.svg/1024px-Creative-Tail-People-boy.svg.png";
            }



            $('.summernote').summernote({
              height: 200
            });

            if ($state.current.name == 'login' && $scope.userId) {
                $state.go('app.post');
            }
            $scope.message = '';
            $scope.verify = function() {
                console.log($stateParams.id);
                User.verify($stateParams.id)
                    .then(function(response){
                        console.log(response);
                        $scope.user = {
                            'status' : '1',
                            'email' : response.data.email
                        };
                        User.updateStatus($scope.user).then(function(data) {
                            console.log("Mongo data : " + data);
                            $scope.message = "Email is verified !";
                        })
                        // $state.go('login');
                    });
            }

            $scope.login = function() {
                var thisUser = {};
                thisUser.email = $scope.formData.email;
                thisUser.password = $scope.formData.password;
                User.login(thisUser)
                    .then(function(response) {
                        console.log(response);
                        if(response.auth){

                            var authData = {};
                            authData.token = response.token;
                            $cookies.access_token = response.token;

                            User.authenticate(authData)
                                .then(function(data) {
                                    console.log(data);
                                    if(data.status == '1'){
                                        $cookies.handle = data.handle;
                                        $cookies.email = data.email;
                                        $cookies._id = data._id;
                                        $cookies.type = data.type;
                                        setTimeout(function() {
                                            toastr.options = {
                                                closeButton: true,
                                                progressBar: true,
                                                showMethod: 'fadeIn',
                                                hideMethod: 'fadeOut',
                                                timeOut: 3000
                                            };
                                            toastr.success('Welcome back '+data.handle, 'Success !');
                                        }, 500);
                                        $state.go('app.dashboard');
                                    }
                                    else{
                                        setTimeout(function() {
                                            toastr.options = {
                                                closeButton: true,
                                                progressBar: true,
                                                showMethod: 'fadeIn',
                                                hideMethod: 'fadeOut',
                                                timeOut: 3000
                                            };
                                            toastr.warning('Please verify your email!');
                                        }, 500);
                                    }
                                }, function(error) {
                                    console.log(error);
                                    setTimeout(function() {
                                        toastr.options = {
                                            closeButton: true,
                                            progressBar: true,
                                            showMethod: 'fadeIn',
                                            hideMethod: 'fadeOut',
                                            timeOut: 3000
                                        };
                                        toastr.error(error, 'Error !');
                                    }, 1000);
                                });
                        }
                    }, function(error) {
                        console.log(error);
                        setTimeout(function() {
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'fadeIn',
                                hideMethod: 'fadeOut',
                                timeOut: 3000
                            };
                            toastr.error(error, 'Error !');
                        }, 1000);
                    });
            }

            $scope.register = function() {
                var thisUser = {};
                thisUser.handle = $scope.formData.handle;
                thisUser.email = $scope.formData.email;
                thisUser.password = $scope.formData.password;
                thisUser.phone = $scope.formData.phone;
                thisUser.company = $scope.formData.company;
                thisUser.vertical = $scope.formData.vertical;

                // console.log("inside createPost ", newPost);
                User.register(thisUser)
                    .then(function(response) {
                        console.log(response);
                        if(response.auth){
                            $cookies.access_token = response.token;
                            setTimeout(function() {
                                toastr.options = {
                                    closeButton: true,
                                    progressBar: true,
                                    showMethod: 'fadeIn',
                                    hideMethod: 'fadeOut',
                                    timeOut: 3000
                                };
                                toastr.success("Please verify your phone", 'Successfully registered !');
                            }, 500);
                            $scope.message= "Please verify your phone!"
                            // $state.go('login');
                        }
                    }, function(error) {
                        console.log(error);
                        setTimeout(function() {
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'fadeIn',
                                hideMethod: 'fadeOut',
                                timeOut: 3000
                            };
                            toastr.error(error, 'Error !');
                        }, 1000);
                    });
            }

            $scope.verifyPhone = function(code, phone) {
                var thisUser = {};
                thisUser.code = code;
                thisUser.phone = phone;

                console.log("inside verify phone ", code, phone);
                User.verifyPhone(thisUser)
                    .then(function(response) {
                        console.log(response);
                        setTimeout(function() {
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'fadeIn',
                                hideMethod: 'fadeOut',
                                timeOut: 3000
                            };
                            toastr.success("Verified! Please verify your email to continue", 'Successfully registered !');
                        }, 500);
                        $scope.message= "Verified! Please verify your email to continue!"
                        // $state.go('login');
                    }, function(error) {
                        console.log(error);
                        setTimeout(function() {
                            toastr.options = {
                                closeButton: true,
                                progressBar: true,
                                showMethod: 'fadeIn',
                                hideMethod: 'fadeOut',
                                timeOut: 3000
                            };
                            toastr.error(error.data.message, "Error!");
                        }, 1000);
                    });
            }

            $scope.getUserProfile = function(){
                var newObj = {};
                newObj.token = $cookies.access_token;
                User.authenticate(newObj)
                    .then(function(user) {
                        $scope.profileData = user;
                        var total = parseInt($scope.profileData.share_count)+parseInt($scope.profileData.like_count)+parseInt($scope.profileData.comment_count);
                        $scope.totalBalance = total * 0.01;
                        console.log($scope.totalBalance);
                        var data = {};
                        data.user_id = user._id;
                        data.credits = $scope.totalBalance;
                        User.updateBalance(data)
                            .then(function(response) {
                                console.log(response);
                            }, function(err){
                                console.log(err);
                            });
                    })
            }

            $scope.posts = [];

            if ($state.current.name = "app.post") {
                Post.get()
                    .success(function(response) {
                        // console.log("response ", response);
                        angular.forEach(response, function(val) {
                            $scope.posts.push(val);
                        })
                    });
            }

            $scope.thisPost = {};
            $scope.getPost = function(){
                var post_id = $state.params.postId;
                Post.getOne(post_id)
                    .success(function(response) {
                        console.log("response ", response);
                        $scope.thisPost._id = response._id;
                        $scope.thisPost.title = response.title;
                        $scope.thisPost.description = response.description;
                        $scope.thisPost.caption = response.caption;
                        $scope.thisPost.image = response.image;
                        $scope.thisPost.url = response.url;
                        $scope.thisPost.share_count = response.share_count;
                        $scope.thisPost.like_count = response.like_count;
                        $scope.thisPost.comment_count = response.comment_count;
                        $scope.thisPost.budget = response.budget;
                    });
            }

            // console.log("all posts -- ", $scope.posts);

            $scope.createPost = function() {
                if($scope.loggedInUser.type == '1'){
                    var newPost = {};
                    newPost.title = $scope.postData.title;
                    newPost.url = $scope.postData.url;
                    newPost.description = $scope.postData.description;
                    newPost.caption = $scope.postData.caption;
                    newPost.image = $scope.postData.image;
                    newPost.share_count = '0';
                    newPost.cost_per_share = $scope.postData.cost_per_share;
                    newPost.cost_per_like = $scope.postData.cost_per_like;
                    newPost.cost_per_comment = $scope.postData.cost_per_comment;
                    newPost.budget = $scope.postData.budget;
                    newPost.created_by_id = $scope.loggedInUser.id;

                    console.log("inside createPost ", newPost);
                    Post.create(newPost)
                        .success(function(response) {
                            var resp = JSON.stringify(response);
                            // console.log("Create post data : " + resp);
                            setTimeout(function() {
                                toastr.options = {
                                    closeButton: true,
                                    progressBar: true,
                                    showMethod: 'fadeIn',
                                    hideMethod: 'fadeOut',
                                    timeOut: 3000
                                };
                                toastr.success("New post created !", 'Success !');
                            }, 500);
                        })
                        .error(function(error) {
                            setTimeout(function() {
                                toastr.options = {
                                    closeButton: true,
                                    progressBar: true,
                                    showMethod: 'fadeIn',
                                    hideMethod: 'fadeOut',
                                    timeOut: 3000
                                };
                                toastr.error("Error occured. Contact admin!", 'Error !');
                            }, 500);
                        })
                }
                else{
                    setTimeout(function() {
                        toastr.options = {
                            closeButton: true,
                            progressBar: true,
                            showMethod: 'fadeIn',
                            hideMethod: 'fadeOut',
                            timeOut: 3000
                        };
                        toastr.error("Unauthorized access. Contact admin!", 'Error !');
                    }, 500); 
                }
            }

            $scope.paymentmsg = '';

            $scope.creditEther = function(address, ethers){
                ethers = ethers * 1000000000000000000;

                console.log(address, ethers);

                var walletUrl = 'http://40.117.39.102:8080/api/sendCoin';
                var data = {
                    'sender': '0xC801C62493F89d3550bbb953b37483afCAb0c930',
                    'recipient': address,
                    'amount': ethers,
                    'password': 'daewoo123'
                };
                var headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };

                function longsToStrings(response) {
                    //console.log("transforming response");
                    var numbers = /("[^"]*":\s*)(\d{15,})([,}])/g;
                    var newResponse = response.replace(numbers, "$1\"$2\"$3");
                    return newResponse;
                }

                $http({
                    method: 'POST',
                    url: walletUrl,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: data
                }).then(function(resp) {
                    console.log(resp);
                    setTimeout(function() {
                        toastr.options = {
                            closeButton: true,
                            progressBar: true,
                            showMethod: 'fadeIn',
                            hideMethod: 'fadeOut',
                            timeOut: 3000
                        };
                        toastr.success("txHash : "+resp.data.txHash, 'Payment Success!');

                    }, 500);
                    $scope.paymentmsg = resp.data.txHash;
                    data.user_id = $cookies.userId;
                    data.credits = 0;
                    User.updateBalance(data)
                        .then(function(response) {
                            console.log(response);
                        }, function(err){
                            console.log(err);
                        });
                }, function(error){
                    console.log(error);
                    setTimeout(function() {
                        toastr.options = {
                            closeButton: true,
                            progressBar: true,
                            showMethod: 'fadeIn',
                            hideMethod: 'fadeOut',
                            timeOut: 3000
                        };
                        toastr.success(error, "Payment successfull!");
                    }, 500);
                })
            }

            $scope.share = function(post) {
                console.log(post);
                FB.ui({
                    // method: 'share_open_graph',
                    // action_type: 'og.shares',
                    // action_properties: JSON.stringify({
                    //     object: {
                    //         'og:url': post.url, // your url to share
                    //         'og:title': post.title,
                    //         'og:site_name': post.caption,
                    //         'og:description': post.description,
                    //         'og:image': post.image,
                    //         'og:image:width': '200', //size of image in pixel
                    //         'og:image:height': '200',
                    //         'fb:app_id': 154544875148760
                    //     }
                    // })

                    method : 'feed',
                    link : post.url,
                    picture : post.image,
                    caption : post.caption,
                    name : post.title,
                    description : post.description
                }, function(response) {
                    if (response) {
                        console.log("fb share post id : ", response, post._id);
                        var updatePost = {};
                        updatePost._id = post._id;
                        updatePost.fb_share_id = response.post_id;
                        if(post.share_count){
                            updatePost.share_count = parseInt(post.share_count) + 1;
                        }
                        else{
                            updatePost.share_count = '1';
                        }

                        Post.update(post._id, updatePost)
                            .success(function(response) {
                                var resp = JSON.stringify(response);
                            });

                        var sharePost = {};
                        sharePost.fb_post_id = response.post_id;
                        sharePost.fb_user_id = $cookies.fbUserId;
                        sharePost.post_id = post._id;
                        sharePost.user_id = $cookies.userId;
                        sharePost.token = $cookies.access_token;

                        Share.create(sharePost)
                            .success(function(response) {
                                var resp = JSON.stringify(response);
                            });

                        User.authenticate(sharePost)
                            .then(function(user) {
                                var updateUser = {};
                                updateUser.user_id = user._id;
                                updateUser.share_count = parseInt(user.share_count) + 1;
                                console.log(user, updateUser);
                                User.updateShare(updateUser)
                                    .success(function(resp) {
                                        console.log(resp);
                                        setTimeout(function() {
                                            toastr.options = {
                                                closeButton: true,
                                                progressBar: true,
                                                showMethod: 'fadeIn',
                                                hideMethod: 'fadeOut',
                                                timeOut: 3000
                                            };
                                            toastr.success("Post successfully shared!", 'Shared !');
                                        }, 500);
                                    })
                            })
                    } else {
                        console.log("User cancelled share");
                    }
                });
            }

            $scope.getFBShareCount = function() {

                // $scope.userData = [];
                // $scope.sharesData = [];
                // $scope.allShareData = [];

                // Share.get()
                //     .success(function(response) {
                //         var to_push = {};
                //         angular.forEach(response, function(share){
                //             to_push.user_id = share.user_id;
                //             to_push.post_id = share.post_id;
                //             to_push.fb_user_id = share.fb_user_id;
                //             to_push.fb_post_id = share.fb_post_id;

                //             User.getone(share)
                //                 .success(function(user){
                //                     to_push.user_name = user[0].name;
                //                     to_push.user_email = user[0].email;
                //                     $scope.allShareData.push(to_push);
                //                     to_push = {};
                //                 })
                //         })
                //     });

                $scope.postShareData = [];

                Post.get()
                    .success(function(response) {
                        var to_post = {};
                        angular.forEach(response, function(post) {
                            to_post.post_title = post.title;
                            to_post.share_count = post.share_count;
                            to_post.post_id = post._id;
                            $scope.postShareData.push(to_post);
                            to_post = {};
                        })
                    })


                // console.log("all share -- ", $scope.postShareData);
            }

            $scope.allUserShareData = [];
            $scope.getUserShareCount = function() {
                console.log("--- here");
                User.getall()
                    .success(function(user) {
                        console.log(user);
                        var to_push = {};
                        angular.forEach(user, function(value) {
                            to_push._id = value._id;
                            to_push.user_name = value.name;
                            to_push.user_email = value.email;
                            to_push.share_count = value.share_count;
                            to_push.credited_count = value.credited_count;
                            to_push.unpaid_shares = (value.share_count - value.credited_count);
                            $scope.allUserShareData.push(to_push);
                            to_push = {};
                        })
                    })
            }

            // $scope.thisTitle = '';
            $scope.getThisPostData = function(post) {
                // console.log("--- ", post);
                $scope.thisTitle = post.post_title;
                $scope.thisPostData = [];
                Share.get()
                    .success(function(response) {
                        var to_push = {};
                        angular.forEach(response, function(share) {
                            if (share.post_id == post.post_id) {
                                to_push.user_id = share.user_id;
                                to_push.post_id = share.post_id;

                                // User.getone(share)
                                //     .success(function(user) {
                                //         console.log(user);
                                //         to_push.user_name = user[0].name;
                                //         to_push.user_email = user[0].email;
                                //         $scope.thisPostData.push(to_push);
                                //         to_push = {};
                                //     })
                                angular.forEach($scope.allUserShareData, function(user) {
                                    console.log("here --- ", user._id, share.user_id);
                                    if(user._id == share.user_id){
                                        to_push.user_name = user.user_name;
                                        to_push.user_email = user.user_email;
                                        $scope.thisPostData.push(to_push);
                                    }
                                });
                                to_push = {};
                            }
                        })
                    })
                console.log("$scope.thisPostData", $scope.thisPostData);
            }

            function getUserData() {
                FB.api('/me', function(response) {
                    // console.log('loggedin', response);
                });
            }

            $scope.getSharedData = function() {

                var user_id = $cookies.fbUserId;
                var access_token = $cookies.fb_access_token;
                var page_access_token = '';
                FB.api('/me/accounts', { access_token: access_token },
                    function(response) {
                        console.log("me/accounts ",response);
                        if(response.error){
                            $scope.checkLoginState();
                        }
                        else{
                            angular.forEach(response.data, function(val, key) {
                                if (val.name == "Tover") {
                                    page_access_token = val.access_token;
                                    // console.log("Page access token ", access_token);
                                    FB.api('/me/tagged', { access_token: page_access_token },
                                        function(response) {
                                            // console.log("all tagged data : "+response.data);
                                            var shareCount=0;
                                            var likeCount=0;
                                            var commentCount=0;
                                            angular.forEach(response.data, function(value, key) {
                                                // console.log(value);
                                                var split_id = value.id.split('_');

                                                if(split_id[1] != '1757219684300308' && split_id[1] != '10213749241141505' && split_id[1] != '10154893949016641'){
                                                    FB.api('/'+value.id+'?fields=shares,likes,comments', {access_token : page_access_token},
                                                        function(response) {
                                                            // $scope.data = {};
                                                            // $scope.data.fb_id = split_id[0];
                                                            // $scope.data.user_id = $cookies._id;
                                                            // if(angular.isDefined(response.shares)){
                                                            //     $scope.data.share_count = response.shares.count.toString();
                                                            // }
                                                            // if(angular.isDefined(response.likes)){
                                                            //     $scope.data.like_count = response.likes.data.length.toString();
                                                            // }
                                                            // if(angular.isDefined(response.comments)){
                                                            //     $scope.data.comment_count = response.comments.data.length.toString();
                                                            // }
                                                            // console.log(split_id[1], $scope.data.share_count, $scope.data.like_count, $scope.data.comment_count);
                                                            // // var fsid = int(split_id[1])-2;
                                                            // try{
                                                            //     if($scope.data.share_count || $scope.data.like_count || $scope.data.comment_count){
                                                            //         User.updateCount($scope.data)
                                                            //             .then(function(response) {
                                                            //                 console.log(response);
                                                            //             }, function(err){
                                                            //                 console.log(err);
                                                            //             });
                                                            //     }
                                                            // }
                                                            // catch (e){
                                                            //     console.log("Error : ", e);   
                                                            // }
                                                            if(angular.isDefined(response.shares)){
                                                                shareCount += response.shares.count;
                                                            }
                                                            if(angular.isDefined(response.likes)){
                                                                likeCount += response.likes.data.length;
                                                            }
                                                            if(angular.isDefined(response.comments)){
                                                                commentCount += response.comments.data.length;
                                                            }
                                                            console.log(shareCount, likeCount, commentCount);
                                                            $scope.data = {};
                                                            $scope.data.user_id = $cookies._id;
                                                            $scope.data.share_count = shareCount;
                                                            $scope.data.like_count = likeCount;
                                                            $scope.data.comment_count = commentCount;

                                                            console.log($scope.data);

                                                            if($scope.data.share_count || $scope.data.like_count || $scope.data.comment_count){
                                                                User.updateCount($scope.data)
                                                                    .then(function(response) {
                                                                        console.log(response);
                                                                    }, function(err){
                                                                        console.log(err);
                                                                    });
                                                            }
                                                        });
                                                }

                                            })


                                        }
                                    );
                                }
                            })
                        }
                    }

                );

                $scope.getUserProfile();

            }
            // Facebook
            window.fbAsyncInit = function() {
                FB.init({
                    appId: '154544875148760',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v2.10'
                });
                FB.AppEvents.logPageView();
                FB.Canvas.setAutoGrow(false);
                FB.Canvas.setSize({ width: 640, height: 480 });

                FB.Canvas.setDoneLoading(function(result) {
                    FB.Canvas.setSize({ height: $('#wrapper').height(480) });
                });
                // };
                // if($scope.userId == ''){
                //     $scope.getLoginCreds();
                // }
            };

            jQuery(window).load(function() {
                //resize our tab app canvas after our content has finished loading
                FB.Canvas.setSize();
            });
            // 10212060023432118_10213749241141505?fields=shares
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            $scope.checkLoginState = function() {
                console.log('clicked');
                console.log('not connected idiot');
                FB.login(function(response) {
                    if (response.authResponse) {
                        // console.log(response.authResponse.accessToken);
                        console.log('facebook auth called ------', response);
                        $scope.getLoginCreds();
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                    }
                }, { scope: 'email, manage_pages, publish_actions' });
            }

            $scope.getLoginCreds = function() {
                $scope.user = {};
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        console.log("response ", $state.current.name);
                        // socialInit(response.authResponse.accessToken, "facebook");
                        $scope.user.fb_access_token = response.authResponse.accessToken;
                        FB.api('/me', { locale: 'en_US', fields: 'id,name,email,first_name,last_name,gender,link,locale,timezone,picture' }, function(response) {
                            // console.log(response);
                            $scope.user.user_id = $cookies._id;
                            $scope.user.fb_id = response.id;
                            $scope.user.name = response.name;
                            $scope.user.image = response.picture.data.url;
                            $scope.user.fb_profile_url = response.link;

                            User.update($scope.user).success(function(data) {
                                console.log("Mongo data : " + data, $state.current.name);
                                setTimeout(function() {
                                    toastr.options = {
                                        closeButton: true,
                                        progressBar: true,
                                        showMethod: 'fadeIn',
                                        hideMethod: 'fadeOut',
                                        timeOut: 3000
                                    };
                                    toastr.success("Successfully connected to facebook !", 'Connected !');
                                }, 500);

                                var authData = {};
                                authData.token = $cookies.access_token;

                                User.authenticate(authData).then(function(data) {
                                        console.log(data);
                                        $cookies.userId = data._id;
                                        $cookies.fbUserId = data.fb_id;
                                        $cookies.name = data.name;
                                        $cookies.image = data.image;
                                        $cookies.fb_access_token = data.fb_access_token;
                                        setTimeout(function() {
                                            toastr.options = {
                                                closeButton: true,
                                                progressBar: true,
                                                showMethod: 'fadeIn',
                                                hideMethod: 'fadeOut',
                                                timeOut: 3000
                                            };
                                            toastr.success('Welcome back '+data.handle, 'Success !');
                                            $timeout(function() {
                                                window.location.reload();
                                            }, 2000);
                                        }, 500);
                                    }, function(error) {
                                        console.log(error);
                                        setTimeout(function() {
                                            toastr.options = {
                                                closeButton: true,
                                                progressBar: true,
                                                showMethod: 'fadeIn',
                                                hideMethod: 'fadeOut',
                                                timeOut: 3000
                                            };
                                            toastr.error(error, 'Error !');
                                    }, 1000);
                                });
                            });
                        });
                    } 
                    else {
                        console.log('Not connected');
                    }
                });
            }

            // if($scope.loggedInUser.fbUserId){
            //     $scope.getLoginCreds();
            // }
        }
    ]);