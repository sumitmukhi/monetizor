angular.module('todoController', [])

    .controller('mainController', ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$cookies', '$cookieStore', 'Todos', 'User', 'Post', 'Share', 'Tagged',
        function($scope, $rootScope, $http, $state, $stateParams, $cookies, $cookieStore, Todos, User, Post, Share, Tagged) {
            $scope.formData = {};
            $scope.postData = {};
            $scope.userId = $cookies.userId;
            $scope.userName = $cookies.name;
            $scope.userImage = $cookies.image;

            if ($state.current.name == 'login' && $scope.userId) {
                $state.go('app.post');
            }

            Todos.get()
                .success(function(data) {
                    $scope.todos = data;
                    $scope.loading = false;
                });

            $scope.createTodo = function() {
                if ($scope.formData.text != undefined) {
                    Todos.create($scope.formData)
                        .success(function(data) {
                            $scope.formData = {};
                            $scope.todos = data;
                        });
                }
            };

            $scope.deleteTodo = function(id) {
                Todos.delete(id)
                    .success(function(data) {
                        $scope.todos = data;
                    });
            };

            $scope.login = function() {
                var thisUser = {};
                thisUser.email = $scope.formData.email;
                thisUser.password = $scope.formData.password;

                // console.log("inside createPost ", newPost);
                User.authenticate(thisUser)
                    .success(function(response) {
                        var resp = JSON.stringify(response);
                        // console.log("Create post data : " + resp);
                    });
            }

            $scope.register = function() {
                var thisUser = {};
                thisUser.email = $scope.formData.email;
                thisUser.password = $scope.formData.password;

                // console.log("inside createPost ", newPost);
                User.register(thisUser)
                    .success(function(response) {
                        var resp = JSON.stringify(response);
                        // console.log("Create post data : " + resp);
                    });
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

            // console.log("all posts -- ", $scope.posts);

            $scope.createPost = function() {
                var newPost = {};
                newPost.title = $scope.postData.title;
                newPost.url = $scope.postData.url;
                newPost.description = $scope.postData.description;
                newPost.caption = $scope.postData.caption;
                newPost.image = $scope.postData.image;

                // console.log("inside createPost ", newPost);
                Post.create(newPost)
                    .success(function(response) {
                        var resp = JSON.stringify(response);
                        // console.log("Create post data : " + resp);
                    });
            }

            $scope.share = function(post) {
                // console.log(post);
                FB.ui({
                    method: 'share_open_graph',
                    action_type: 'og.shares',
                    action_properties: JSON.stringify({
                        object: {
                            'og:url': post.url, // your url to share
                            'og:title': post.title,
                            'og:site_name': post.caption,
                            'og:description': post.description,
                            'og:image': post.image,
                            'og:image:width': '200', //size of image in pixel
                            'og:image:height': '200',
                            'fb:app_id': 154544875148760
                        }
                    })
                }, function(response) {
                    if (response) {
                        console.log("fb share post id : ", response);
                        var updatePost = {};
                        updatePost._id = post._id;
                        updatePost.fb_share_id = response.post_id;
                        updatePost.share_count = parseInt(post.share_count) + 1;

                        Post.update(updatePost)
                            .success(function(response) {
                                var resp = JSON.stringify(response);
                            });

                        var sharePost = {};
                        sharePost.fb_post_id = response.post_id;
                        sharePost.fb_user_id = $cookies.fbUserId;
                        sharePost.post_id = post._id;
                        sharePost.user_id = $cookies.userId;

                        Share.create(sharePost)
                            .success(function(response) {
                                var resp = JSON.stringify(response);
                            });

                        User.getone(sharePost)
                            .success(function(user) {
                                var updateUser = {};
                                updateUser.user_id = user[0]._id;
                                updateUser.share_count = parseInt(user[0].share_count) + 1;
                                console.log(user, updateUser);
                                User.update(updateUser)
                                    .success(function(resp) {})
                            })
                    } else {
                        console.log("User cancelled share");
                    }
                });
            }


            $scope.getSharedData = function() {

                var user_id = $cookies.userId;
                var access_token = '';
                FB.api('/me/accounts',
                    function(response) {
                        // console.log("me/accounts ",response);
                        angular.forEach(response.data, function(val, key) {
                            if (val.name == "Tover") {
                                access_token = val.access_token;
                                // console.log("Page access token ", access_token);
                                FB.api('/me/tagged', { access_token: val.access_token },
                                    function(response) {


                                        angular.forEach(response.data, function(value, key) {
                                            var tagData = {};
                                            console.log(value);
                                            tagData.tag_id = value.id;
                                            tagData.tag_time = value.tagged_time;

                                            Tagged.create(tagData)
                                                .success(function(response) {
                                                    var resp = JSON.stringify(response);
                                                    // console.log("New tags : " + resp);
                                                });
                                            // var split_id = val.id.split('_');
                                            // if(split_id[0] == user_id){
                                            //     console.log(val);
                                            //     FB.api('/'+val.id+'?fields=shares', {access_token : $scope.page_access_token},
                                            //     function(response) {
                                            //         console.log(response)
                                            //     });
                                            // }
                                        })
                                    }
                                );
                            }
                        })
                    }

                );

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

                                User.getone(share)
                                    .success(function(user) {
                                        console.log(user);
                                        to_push.user_name = user[0].name;
                                        to_push.user_email = user[0].email;
                                        $scope.thisPostData.push(to_push);
                                        to_push = {};
                                    })
                            }
                        })
                    })
            }

            $scope.getUserShareCount = function() {
                console.log("--- here");
                $scope.allUserShareData = [];
                User.getall()
                    .success(function(user) {
                        console.log(user);
                        var to_push = {};
                        angular.forEach(user, function(value) {
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

            function getUserData() {
                FB.api('/me', function(response) {
                    // console.log('loggedin', response);
                });
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
                        FB.api('/me', { locale: 'en_US', fields: 'id,name,email,first_name,last_name,gender,link,locale,timezone,picture' },
                            function(response) {
                                // console.log(response);
                                $scope.user.fb_id = response.id;
                                $scope.user.name = response.name;
                                $scope.user.email = response.email;
                                $scope.user.image = response.picture.data.url;
                                $scope.user.fb_profile_url = response.link;

                                User.get($scope.user)
                                    .success(function(data) {
                                        console.log("Mongo data : " + data[0].email, $state.current.name);
                                        $cookies.userId = data[0]._id;
                                        $cookies.fbUserId = data[0].fb_id;
                                        $cookies.name = data[0].name;
                                        $cookies.image = data[0].image;
                                        $cookies.fb_access_token = data[0].fb_access_token;
                                        $state.go('app.post');
                                        // window.location.reload();
                                    });
                            }
                        );
                    } else {}
                });
            }
        }
    ]);