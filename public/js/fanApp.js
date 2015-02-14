var fanApp = angular.module('fanApp', ['ngRoute', 'ngAnimate', 'ngSanitize']);

var manMail = new mandrill.Mandrill('rYwkbK4FxF85oX2tkVihXQ');

Parse.initialize("6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn", "uGMBTBgVzqWYwohD5O5YgtjOBWub7TcEZGT422nO");

fanApp.config(function($routeProvider) {
    $routeProvider  
        .when('/', {
                templateUrl: 'pages/splash.html',
                controller  : 'splashController',
                bodyClass: 'splash',
                pageIdx: 0
        })

        .when('/home', {
                templateUrl : 'pages/fanHome.html',
                controller  : 'homeController',
                bodyClass: 'home',
                pageIdx: 1
  
        })

        .when('/spotlight', {
                templateUrl: 'pages/spotlight.html',
                controller: 'spotController',
                bodyClass: 'spotlight',
                pageIdx: 2
        })

        .when('/spotlight/:idx?', {
                templateUrl: 'pages/spotlight.html',
                controller: 'spotController',
                bodyClass: 'spotlight',
                pageIdx: 2
        })

        .when('/spotlight/id/:id?', {
                templateUrl: 'pages/spotlight.html',
                controller: 'spotController',
                bodyClass: 'spotlight',
                pageIdx: 2
        })        

        .when('/talk', {
                templateUrl: 'pages/fanTalk.html',
                controller: 'talkController',
                bodyClass: 'talk',
                pageIdx: 3
        })

        .when('/talk/:id?', {
                templateUrl: 'pages/fanTalk.html',
                controller: 'talkController',
                bodyClass: 'talk',
                pageIdx: 3
        })

        .otherwise({redirectTo: '/home'});
});

fanApp.run( ['$rootScope', '$routeParams', '$location', '$route', '$http', function($scope, $routeParams, $location, $route, $http) {
      
    $scope.$on('$routeChangeStart', function(e, next, current) { 

    });

    $scope.$on('$routeChangeSuccess', function(e, current) { 

        $scope.menuLink = current.pageIdx;

        if(current.bodyClass){
            $("body").removeClass().addClass(current.bodyClass);
        }

        if(current.controller != 'homeController'){
            $scope.hideMenu = false;
        }

        $( window ).load(function() {
            $("menu").css('border-top','solid 4px #5CE65C');
        });

    });

    window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({ // this line replaces FB.init({
          appId      : '357384804445447', // Facebook App ID
          status     : true,  // check Facebook Login status
          cookie     : true,  // enable cookies to allow Parse to access the session
          xfbml      : true,  // initialize Facebook social plugins on the page
          version    : 'v2.2' // point to the latest Facebook Graph API version
        });
     
        // Run code after the Facebook SDK is loaded.
        FB.getLoginStatus(function(response) {
            $scope.isProcessing = true;
            if (response.status === 'connected' && Parse.FacebookUtils.isLinked) {
                if(!Parse.User.current()){
                    $scope.facebookLogin();
                }else{
                    FB.api('/me', function(response) {
                        console.log(Parse.User.current());
                        $scope.userToken = Parse.User.current().id;
                        $scope.user = response;
                        $scope.username = response.name;
                        $scope.isProcessing = false;
                        $scope.setProfilePic();
                        $scope.setUserToken();
                        $scope.$apply();
                    });
                }
            }
            else if(Parse.User.current()) {
                $scope.user = Parse.User.current();
                var user = Parse.User.current();
                user.fetch().then(function(fetchedUser){
                    $scope.username = fetchedUser.get("display_name");
                    $scope.userToken = fetchedUser.get("username");
                    $scope.setProfilePic();
                    $scope.setUserToken();
                    $scope.isProcessing = false;
                    $scope.$apply();
                }, function(error){
                    return false;
                });
            }else{
                $scope.isProcessing = false;
                $scope.$apply();
            }
       });
    };


 
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

    $scope.setProfilePic = function() {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected' && Parse.FacebookUtils.isLinked) {
                // the FQL query: Get the link of the image, that is the first in the album "Profile pictures" of this user.
                FB.api('/me', function (response) {

                    // the FQL query: Get the link of the image, that is the first in the album "Profile pictures" of this user.
                    $(".profile-pic").attr("src", "http://graph.facebook.com/"+response.id+"/picture?type=large");
                    $scope.profileUrl = "http://graph.facebook.com/"+response.id+"/picture?type=large";
                    $scope.$apply();

                });
            }else{
                var user = Parse.User.current();
                user.fetch().then(function(fetchedUser){
                    var image = fetchedUser.get("profile");
                    $(".profile-pic").attr("src", image._url);
                    $scope.profileUrl = image._url;
                    $scope.$apply();
                }, function(error){
                    return false;
                });
            }
        });
    }

    $scope.facebookLogin = function(){
        $scope.showLoginForm = false;
        $scope.showModalDialog = false;
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            console.log(user);
            if (!user.existed()) {
                $scope.user = user;
                FB.api('/me', function(response) {
                    console.log(response);
                    $scope.username = response.name;
                    $scope.isProcessing = false;
                    $scope.setProfilePic();
                    $scope.setUserToken();
                    $scope.$apply();
                });
                $scope.$apply();
            } else {
                $scope.user = user;
                FB.api('/me', function(response) {
                    console.log(response);
                    $scope.username = response.name;
                    $scope.isProcessing = false;
                    $scope.setProfilePic();
                    $scope.setUserToken();
                    $scope.$apply();
                });
                $scope.$apply();
            }
          },
          error: function(user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
          }
        });
    }

    $scope.setUserToken = function() {
        var user = Parse.User.current();
        user.fetch().then(function(fetchedUser){
            console.log(fetchedUser.id);
            $scope.userToken = fetchedUser.id;
            $scope.$apply();
        });
    }   

}]);

fanApp.service('FanUser', function(){
    this.checkSession = function(){
        var user = Parse.User.current();
        user.fetch().then(function(fetchedUser){
            return fetchedUser;
        }, function(error){
            return false;
            //Handle the error
        });
    }

    this.save = function(){
        var User = Parse.User.current();
        if(User && User.get("username") != null && User.get("firstName") != null){
            User.save(null, {
                success: function(user) {
                    return user;
                },
                error: function(user, error){
                    return false;
                }
            });
        }else{
            Parse.User.logOut();
            return false;
        }
    }
    this.register = function(user){
        return Parse.Cloud.run('registerUser', user, {
            success: function(user){
                return user;
            },
            error: function(error) {
                return error;
            }
        });
    }

    this.facebookInit = function() {
        
    }

    this.facebookUsername = function(){

        Parse.FacebookUtils.api('/me', function(response) {
            console.log(response);
            return response.name;
        });
    }

    this.getName = function(){
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected' && Parse.FacebookUtils.isLinked) {
                Parse.FacebookUtils.api('/me', function(response) {
                    return response.name;
                });
            }else{
                return $scope.display_name;
            }
        });
    }

    /*this.isAdmin = function(id){
        return Parse.Cloud.run('checkAdmin', id, {
            success: function(result){
                return result;
            },
            error: function(error){
                return error;
            }
        });
    }

    this.getInfo = function(username) {
        return Parse.Cloud.run('getInfo', username, {
            success: function(results) {
                return results;
            },
            error: function(error) {
                return error;
            }
        });
    }*/

});

fanApp.controller('bodyController', function($scope, $filter, $http, $location, $route, $routeParams, FanUser){

    if($routeParams.controller != 'homeController'){
        $("#main").css('padding-top','75px');
    }else{
        $("#main").css('padding-top', '0px');
    }

    $http({method: 'GET', url: 'https://api.parse.com/1/classes/Rants',
        headers: { 'X-Parse-Application-Id':'6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn', 'X-Parse-REST-API-Key':'nHpTYmSSgLd1P0znvsPKUWdNJTjs0fmjoltZKvvz'}}).
        success(function(data, status) {
            $scope.rants = data.results;
        }).
        error(function(data, status) {
            console.log(data);
        });

    $scope.states = $filter('getStates')();

    $scope.showLogin = function(){
        $scope.showLoginForm = true;
    }

    $scope.formatDateTime = function(date){
        return moment(date).format("MM/DD/YYYY | hh:mm A");
    }

    $scope.loginUser = function(form){
        Parse.User.logIn(form.username, form.password, {
            success: function(user) {
                $scope.user = user;
                $scope.username = user.get("display_name");
                $scope.email = user.get("email");
                $scope.setModalMsg("Welcome, "+$scope.username);
                $scope.$apply();
            },
            error: function(user, error) {
                $scope.setModalMsg("Invalid Login. Please Try Again.");
                $scope.$apply();
            }
        });
    }

    $scope.setUploadProfilePic = function(){
        var fileUploadControl = $("#profilePhotoFileUpload")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "photo.jpg";

            var parseFile = new Parse.File(name, file);
            parseFile.save();
            $scope.register.profile = parseFile;
        }
    }

    $scope.registerUser = function(form){

        var newUser = {
            email: form.email,
            username: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
            display_name: form.display_name,
            profile: form.profile
        };

        Parse.Cloud.run('registerUser', newUser, {
            success: function(user){
                var object = {
                    username: $scope.register.email,
                    password: $scope.register.password
                }
                angular.copy({}, $scope.register);
                $scope.registerForm.$setPristine();
                $scope.showLoginForm = false;
                $scope.setModalMsg("Thank You! An email confirmation link will be sent to your inbox shortly.");
                $scope.$apply();
            },
            error: function(error) {
                console.log(error);
                console.log(error.message);
                $scope.setModalMsg("Unable to sign up, "+ error.message);
                $scope.$apply();
            }
        });

    }

    $scope.facebookLogin = function(){
        $scope.showLoginForm = false;
        $scope.showModalDialog = false;
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            if (!user.existed()) {
                $scope.user = user;
                FB.api('/me', function(response) {
                    console.log(response);
                    $scope.username = response.name;
                    $scope.setProfilePic();
                    $scope.setModalMsg("Logged in through Facebook! \nWelcome, "+$scope.username);
                    $scope.$apply();
                });
                $scope.$apply();
            } else {
                $scope.user = user;
                FB.api('/me', function(response) {
                    console.log(response);
                    $scope.username = response.name;
                    $scope.setProfilePic();
                    $scope.setModalMsg("Already logged in through Facebook! \nWelcome, "+$scope.username);
                    $scope.$apply();
                });
                $scope.$apply();
            }
          },
          error: function(user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
          }
        });
    }

    $scope.logout = function(){
        Parse.User.logOut();
        $scope.user = null;
    }

    $scope.resetModal = function(){
        $scope.showModal = false;
        $scope.showModalDialog = false;
        $scope.modal = {};
    }

    $scope.simpleModalMsg = function(){
        $scope.modal.msg = "Is this working?";
        $scope.showModal = true;
    }

    $scope.setModalMsg = function(msg){
        $scope.modal.msg = msg;
        $scope.showModal = true;
    }

    $scope.setModalDialog = function(msg, opt1, opt2){
        $scope.modal.msg = msg;
        $scope.modal.opt1 = opt1;
        $scope.modal.opt2 = opt2;
        $scope.showModalDialog = true;
    }   
    
    $scope.resetModal();
    
});

fanApp.controller('splashController', function($scope, $location, $route){
    $scope.splash = true;
});

fanApp.controller('homeController', function($scope, $location, $route, $timeout, $http, $window){

    $http({method: 'GET', url: 'https://api.parse.com/1/classes/Articles',
        headers: { 'X-Parse-Application-Id':'6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn', 'X-Parse-REST-API-Key':'nHpTYmSSgLd1P0znvsPKUWdNJTjs0fmjoltZKvvz'}}).
        success(function(data, status) {
            $scope.articles = data.results;
            $scope.nextArticle();
        }).
        error(function(data, status) {
            console.log(data);
        });

    $scope.slides = [
        {
            header: 'The Blog',
            text: 'Check out the latest entries in the Fanalytik Blogosphere',
            link: 'http://fanalytik.co/blog/',
            linkType: 2,
            index: 1
        },
        {
            header: 'Spotlight',
            text: 'Who is in the spotlight this week? Check out our highlight blog of the elite and the up and coming.',
            link: '#spotlight',
            linkType: 1,
            index: 2
        },
        {
            header: 'Fan Talk',
            text: 'Let your voice be heard on the latest topics in sports.',
            link: '#talk',
            linkType: 1,
            index: 3
        },
        {
            header: 'Jets',
            text: 'Catch up on our latest analysis of the New York Jets',
            link: 'http://fanalytik.co/blog/category/Jets/',
            linkType: 2,
            index: 4
        }     
    ];

    $scope.slideIdx = 0;

    var sliderEngine = 0; 

    $scope.startSlider = function(){
        $scope.stopSlider();
        $scope.nextSlide();
        sliderEngine = $timeout($scope.nextSlide, 5000);
    }

    $scope.stopSlider = function(){
        $timeout.cancel(sliderEngine);
    }

    $scope.nextSlide = function(){
        $timeout.cancel(sliderEngine);
        if($scope.slideIdx == $scope.slides.length){
            $scope.slideIdx = 1;
        }else{
            $scope.slideIdx++;
        }
        sliderEngine = $timeout($scope.nextSlide, 5000);

    }

    $scope.prevSlide = function(){
        $timeout.cancel(sliderEngine);
        if($scope.slideIdx == 0){
            $scope.slideIdx = $scope.slides.length;
        }else{
            $scope.slideIdx--;
        }
        sliderEngine = $timeout($scope.nextSlide, 5000);

    }

    $scope.goSlide = function(idx){
        $timeout.cancel(sliderEngine);
        $scope.slideIdx = idx;
        sliderEngine = $timeout($scope.nextSlide, 5000);
    }

    $scope.startSlider();

    $scope.sliderGo = function(){
        if($scope.slides[$scope.slideIdx-1].linkType == 1){
            $window.location.href = $scope.slides[$scope.slideIdx-1].link;
        }else{
            $window.location.href = $scope.slides[$scope.slideIdx-1].link;
        }
    }

    var articleEngine = 0;

    $scope.articleIdx = 0;

    $scope.nextArticle = function(){
        $timeout.cancel(articleEngine);
        $("#article").animate({left: -9999}, 1000);
        if($scope.articleIdx == $scope.articles.length-1){
            $scope.articleIdx = 0;
        }else{
            $scope.articleIdx++;
        }
        $("#article").animate({left: 0});
        articleEngine = $timeout($scope.nextArticle, 7500);
    }

    $scope.prevArticle = function(){
        $timeout.cancel(articleEngine);
        $("#article").animate({left: -9999}, 1000);
        if($scope.articleIdx == 0){
            $scope.articleIdx = $scope.articles.length-1;
        }else{
            $scope.articleIdx--;
        }
        $("#article").animate({left: 0});
        articleEngine = $timeout($scope.nextArticle, 7500);
    }

});


fanApp.controller('spotController', function($scope, $location, $route, $sce, $http, $filter, $routeParams, $timeout){
    $http({method: 'GET', url: 'https://api.parse.com/1/classes/Videos',
        headers: { 'X-Parse-Application-Id':'6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn', 'X-Parse-REST-API-Key':'nHpTYmSSgLd1P0znvsPKUWdNJTjs0fmjoltZKvvz'}}).
        success(function(data, status) {
            $scope.videos = data.results;
            $scope.videos = $filter('orderBy')($scope.videos, "v_id", "reverse");
            if($routeParams.idx){
                console.log($routeParams);
                var idx = parseInt($routeParams.idx);
                $scope.showVideoIdx = idx;
                $scope.isolateVideo = true;
                $scope.$apply();
            }
        }).
        error(function(data, status) {
            console.log(data);
        });

    $scope.refreshVideos = function(){
        $http({method: 'GET', url: 'https://api.parse.com/1/classes/Videos',
            headers: { 'X-Parse-Application-Id':'6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn', 'X-Parse-REST-API-Key':'nHpTYmSSgLd1P0znvsPKUWdNJTjs0fmjoltZKvvz'}}).
            success(function(data, status) {
                $scope.videos = data.results;
            }).
            error(function(data, status) {
                console.log(data);
            });
    }

    $scope.splash = false;
    $scope.hash = "";
    $scope.showVideoIdx = 0;

    $scope.trustSrc = function(src) {
        console.log(src);
        return $sce.trustAsResourceUrl(src);
    }

    $scope.vidCount = 3;

    $scope.morePosts = function(){
        vidCount = vidCount + 3;
    }

    $scope.hasMorePosts = function(){
        if($scope.videos){
            if($scope.vidCount >= $scope.videos.length){
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    $scope.setVideoIdx = function(idx){
        $scope.showVideoIdx = idx;
    }

    $scope.submitVideo = function(){
        var data = $scope.submit;

        data.message = "URL: "+data.url+"\n\n"+"Title: "+data.title;
        
        var email = {
            key: 'rYwkbK4FxF85oX2tkVihXQ',
            message: {
                text: data.message,
                subject: "Video submission from "+data.email,
                from_email: data.email,
                from_name: "Fanalytik User",
                to: [{
                    email: "daniel.essien@gmail.com",
                    name: "Daniel Essien"
                }]
            }
        };

        $http({method: 'POST', data: email, url: 'https://mandrillapp.com/api/1.0/messages/send.json'}).
            success(function(data, status) {
                var messageId = data.objectId;
                angular.copy({}, $scope.submit);
                $scope.videoForm.$setPristine();
                $scope.showVideoForm = false;
            }).
            error(function(data, status) {
                console.log(data);
                alert("Error: Message could not be sent. Please try again.");
            });
    }

});

fanApp.controller('talkController', function($scope, $http, $routeParams, FanUser){

    $scope.topics = [
        "NFL (General)",
        "College Football",
        "Jets",
        "Other"
    ]

    $scope.refreshPosts = function(){
        $scope.isProcessing = true;

        $http({method: 'GET', url: 'https://api.parse.com/1/classes/Articles',
            headers: { 'X-Parse-Application-Id':'6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn', 'X-Parse-REST-API-Key':'nHpTYmSSgLd1P0znvsPKUWdNJTjs0fmjoltZKvvz'}}).
            success(function(data, status) {
                $scope.articles = data.results;
            }).
            error(function(data, status) {
                console.log(data);
            });

        /************************************/

        $http({method: 'GET', url: 'https://api.parse.com/1/classes/Posts',
            headers: { 'X-Parse-Application-Id':'6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn', 'X-Parse-REST-API-Key':'nHpTYmSSgLd1P0znvsPKUWdNJTjs0fmjoltZKvvz'}}).
            success(function(data, status) {
                console.log(data);
                $scope.posts = data.results;
                $scope.selectedPost = $scope.posts[$scope.selectedPostIdx];
            }).
            error(function(data, status) {
                console.log(data);
            });

        /***********************************/

        $http({method: 'GET', url: 'https://api.parse.com/1/classes/Replies',
            headers: { 'X-Parse-Application-Id':'6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn', 'X-Parse-REST-API-Key':'nHpTYmSSgLd1P0znvsPKUWdNJTjs0fmjoltZKvvz'}}).
            success(function(data, status) {
                $scope.replies = data.results;
                $scope.isProcessing = false;
            }).
            error(function(data, status) {
                console.log(data);
            });

    }

    $scope.refreshPosts();

    $scope.selectPost = function(post, idx){
        $scope.selectedPost = post;
        $scope.selectedPostIdx = post;
        var id = $scope.selectedPost.objectId;
        var data = {
            objectId: id
        }
        Parse.Cloud.run('getReplies', data, {
            success: function(results) {
                $scope.selectedReplies = results;
                $scope.$apply();
            },
            error: function(error){
                console.log(error);
            }
        });
        
    }

    $scope.replyWithQuote = function(name, quote){
        $scope.reply2 = {};
        $scope.reply2.message = "["+name+" - "+quote+"]"+"\n\n";
        $scope.showReplyForm2 = true;
    }

    $scope.submitTopic = function(){
        var data = $scope.topic;
        data.name = $scope.username;
        data.profileUrl = $scope.profileUrl;
        data.replyCount = 0;
        $scope.isProcessing = true;
        Parse.Cloud.run('savePost', data, {
            success: function(message){
                angular.copy({}, $scope.topic);
                angular.copy({}, $scope.post);
                $scope.topicForm.$setPristine();
                $scope.showTopicForm = false;
                $scope.isProcessing = false;
                $scope.refreshPosts();
                //$scope.setModalMsg(message);
                $scope.$apply();
            }, error: function(error){
                alert(error);
            }
        });
    }

    $scope.saveReply = function(){
        var data = $scope.reply;
        data.post_id = $scope.selectedPost.objectId;
        data.profileUrl = $scope.profileUrl;
        data.name = $scope.username;
        $scope.isProcessing = true;
        Parse.Cloud.run('saveReply', data, {
            success: function(reply){
                console.log(reply);
                angular.copy({}, $scope.reply);
                $scope.showReplyForm = false;
                $scope.isProcessing = false;
                $scope.reply_form.$setPristine();
                $scope.refreshPosts();
                $scope.incrementReplyCount(reply.get("post_id"));
                $scope.$apply();
            }, 
            error: function(error){
                alert(error);
            }
        });
    }

    $scope.saveReply2 = function(){
        console.log($scope.selectedPost);
        var data = {};
        data.message = $scope.reply2.message;
        data.post_id = $scope.selectedPost.objectId;
        data.profileUrl = $scope.profileUrl;
        data.name = $scope.username;
        $scope.isProcessing = true;
        Parse.Cloud.run('saveReply', data, {
            success: function(reply){
                angular.copy({}, $scope.reply2);
                $scope.showReplyForm = false;
                $scope.isProcessing = false;
                $scope.reply_quote_form.$setPristine();
                $scope.refreshPosts();
                $scope.incrementReplyCount(reply.get("post_id"));
                $scope.$apply();
            }, 
            error: function(error){
                alert(error);
            }
        });
    }

    $scope.incrementReplyCount = function(id){
        console.log(id);
        var replyData = {
            objectId: id
        }
        Parse.Cloud.run('incrementReplies', replyData, {
            success: function(reply) {
                console.log(reply);
                $scope.$apply();
            },
            error: function(error){
                console.log(error);
            }
        });
    }

    $scope.postAgree = function(id) {
        var data = {
            objectId: id, 
            userId: $scope.userToken
        }
        Parse.Cloud.run('postAgree', data, {
            success: function(post) {
                $scope.refreshPosts();
                $scope.$apply();
            }
        });
    }

    $scope.postDisagree = function(id) {
        var data = {
            objectId: id, 
            userId: $scope.userToken
        }
        Parse.Cloud.run('postDisagree', data, {
            success: function(post) {
                $scope.refreshPosts();
                $scope.$apply();
            }
        });
    }

    $scope.replyAgree = function(id) {
        var data = {
            objectId: id, 
            userId: $scope.userToken
        }
        Parse.Cloud.run('replyAgree', data, {
            success: function(post) {
                $scope.refreshPosts();
                $scope.$apply();
            }
        });
    }

    $scope.replyDisagree = function(id) {
        var data = {
            objectId: id, 
            userId: $scope.userToken
        }
        Parse.Cloud.run('replyDisagree', data, {
            success: function(post) {
                $scope.refreshPosts();
                $scope.$apply();
            }
        });
    }

    $scope.hasAgreedPost = function(post) {
        if(post){
            console.log(post);
            if(post.agreeUsers.indexOf(Parse.User.current().id) < 0){
                return false;
            }else{
                return true;
            }
        }
    }

    $scope.hasDisagreedPost = function(post) {
        if(post){
            console.log(post);
            if(post.disagreeUsers.indexOf(Parse.User.current().id) < 0){
                return false;
            }else{
                return true;
            }
        }
    }    

    $scope.hasAgreedReply = function(reply) {
        if(reply){
            if(reply.attributes.agreeUsers.indexOf(Parse.User.current().id) < 0){
                return false;
            }else{
                return true;
            }
        }
    }

    $scope.hasDisagreedReply = function(reply) {
        if(reply){
            if(reply.attributes.disagreeUsers.indexOf(Parse.User.current().id) < 0){
                return false;
            }else{
                return true;
            }
        }
    }

});

fanApp.directive('pageScroll', function($timeout){
    return {
        link: function(scope, elem, attrs) {
            var element = $(elem);
            element.click(function(){
                $timeout(function() {
                    var body = $('body,html');
                    var toElement = attrs.pageScroll;
                    var location = $(toElement);
                    body.animate({scrollTop: location.offset().top - 100}, "slow");
                }, 300, true);
            });
        }
    }
});

fanApp.directive('localScroll', function($timeout){
    return {
        link: function(scope, elem, attrs) {
            var element = $(elem);
            element.click(function(){
                $timeout(function() {
                    var toElement = attrs.localScroll;
                    var location = $(toElement);
                    var onElement = attrs.localBody;
                    var parent = $(onElement);

                    var offsetLocal = location.offset().top - parent.offset().top;

                    parent.animate({scrollTop: offsetLocal}, "slow");

                }, 300, true);
            });
        }
    }
});

fanApp.directive('goLink', function(){
	return{
		link: function(scope, elem, attrs) {
			var element = $(elem);
			element.click(function(){
				window.location = attrs.goLink;
			});
		}
	}
});

fanApp.directive('menuLink', function(){
    return{
        link: function(scope, elem, attrs) {
            var child = $(elem).children("a");
            var ref = $(elem).children("a").attr("href");

            $(elem).click(function(){
                $("#loading").slideDown().delay(1500).slideUp();
                window.location = ref;
            });

        }
    }
});

fanApp.directive('fixedScroll', function(){
    return{
        link: function(scope, elem, attrs) {
            $(window).scroll(function(){
                if($(elem).scrollTop() == 0){
                    $(elem).css('position','fixed');
                    //$(elem).css('margin-top','15px');
                }else{
                    $(elem).css('position', 'relative');
                    //$(elem).css('margin-top','25px');
                }
            });
        }
    }
});

fanApp.directive('callMenu', function(){
    return{
        link: function(scope, elem, attrs) {
            $(window).scroll(function(){
                var scrollPos = $(window).scrollTop();
                if(scrollPos >= 75){
                    $("menu").addClass("fullMenu");
                }else if(scrollPos < 75){
                    $("menu").removeClass("fullMenu");
                }
            });
        }
    }
});

fanApp.directive('disqusBoard', function(){
    return{
        link: function(scope, elem, attrs){
            $(elem).click(function(){
                if( typeof DISQUS != 'undefined' ) { 
                  DISQUS.reset({ 
                    reload: true, 
                     config: function () { 
                       this.page.identifier = 'fanalytik.co'; 
                       this.page.url = 'fanalytik.co';
                     } 
                   }); 
                } 
                var disqus_shortname = 'fanalytik'; // Required - Replace example with your forum shortname
                var disqus_identifier = 'fanalytik.co';
                var disqus_url = 'fanalytik.co';
                var disqus_title = attrs.disqusTitle;
                console.log(disqus_identifier);
                var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                dsq.src = 'http://' + disqus_url + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            });
        }
    }
})

fanApp.directive('formatTextarea', function(){
    return{
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel){
            $(elem).focus(function(){
                $(document).keypress(function(e) {
                    if(e.which == 13) {
                        var temp = $(elem).val();
                        $(elem).val(temp+"<br />");
                    }
                });
            })
        }
    }
});

fanApp.directive('errorMsg', function(){
    return{
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            var inputName = $(elem).attr('name');
            var errorId = "#"+inputName;
            $(elem).parent(".form-input").append("<div id='"+inputName+"' class='error-msg'>"+attrs.errorMsg+"</div>");
            $(elem).blur(function(){
                if(ngModel.$invalid){
                    $(errorId).show('slow');
                }else{
                    $(errorId).hide();
                }
            });
            $(elem).keyup(function(){
                if(!ngModel.$invalid){
                    $(errorId).hide();
                }
            });
        }
    }
});

fanApp.directive('passwordMatch', function(){
    return{
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            var inputName = $(elem).attr('name');
            var errorId = "#"+inputName;
            $(elem).parent(".form-input").append("<div id='"+inputName+"' class='error-msg'>Passwords must match</div>");
            $(elem).blur(function(){
                if($(elem).val() != attrs.passwordMatch){
                    $(errorId).show('slow');
                }else{
                    $(errorId).hide();
                }
            });
        }
    }
});

fanApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

fanApp.filter('getStates', function(){
    return function() {
        var usStates = [
            { name: 'ALABAMA', abbreviation: 'AL'},
            { name: 'ALASKA', abbreviation: 'AK'},
            { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
            { name: 'ARIZONA', abbreviation: 'AZ'},
            { name: 'ARKANSAS', abbreviation: 'AR'},
            { name: 'CALIFORNIA', abbreviation: 'CA'},
            { name: 'COLORADO', abbreviation: 'CO'},
            { name: 'CONNECTICUT', abbreviation: 'CT'},
            { name: 'DELAWARE', abbreviation: 'DE'},
            { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
            { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
            { name: 'FLORIDA', abbreviation: 'FL'},
            { name: 'GEORGIA', abbreviation: 'GA'},
            { name: 'GUAM', abbreviation: 'GU'},
            { name: 'HAWAII', abbreviation: 'HI'},
            { name: 'IDAHO', abbreviation: 'ID'},
            { name: 'ILLINOIS', abbreviation: 'IL'},
            { name: 'INDIANA', abbreviation: 'IN'},
            { name: 'IOWA', abbreviation: 'IA'},
            { name: 'KANSAS', abbreviation: 'KS'},
            { name: 'KENTUCKY', abbreviation: 'KY'},
            { name: 'LOUISIANA', abbreviation: 'LA'},
            { name: 'MAINE', abbreviation: 'ME'},
            { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
            { name: 'MARYLAND', abbreviation: 'MD'},
            { name: 'MASSACHUSETTS', abbreviation: 'MA'},
            { name: 'MICHIGAN', abbreviation: 'MI'},
            { name: 'MINNESOTA', abbreviation: 'MN'},
            { name: 'MISSISSIPPI', abbreviation: 'MS'},
            { name: 'MISSOURI', abbreviation: 'MO'},
            { name: 'MONTANA', abbreviation: 'MT'},
            { name: 'NEBRASKA', abbreviation: 'NE'},
            { name: 'NEVADA', abbreviation: 'NV'},
            { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
            { name: 'NEW JERSEY', abbreviation: 'NJ'},
            { name: 'NEW MEXICO', abbreviation: 'NM'},
            { name: 'NEW YORK', abbreviation: 'NY'},
            { name: 'NORTH CAROLINA', abbreviation: 'NC'},
            { name: 'NORTH DAKOTA', abbreviation: 'ND'},
            { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
            { name: 'OHIO', abbreviation: 'OH'},
            { name: 'OKLAHOMA', abbreviation: 'OK'},
            { name: 'OREGON', abbreviation: 'OR'},
            { name: 'PALAU', abbreviation: 'PW'},
            { name: 'PENNSYLVANIA', abbreviation: 'PA'},
            { name: 'PUERTO RICO', abbreviation: 'PR'},
            { name: 'RHODE ISLAND', abbreviation: 'RI'},
            { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
            { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
            { name: 'TENNESSEE', abbreviation: 'TN'},
            { name: 'TEXAS', abbreviation: 'TX'},
            { name: 'UTAH', abbreviation: 'UT'},
            { name: 'VERMONT', abbreviation: 'VT'},
            { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
            { name: 'VIRGINIA', abbreviation: 'VA'},
            { name: 'WASHINGTON', abbreviation: 'WA'},
            { name: 'WEST VIRGINIA', abbreviation: 'WV'},
            { name: 'WISCONSIN', abbreviation: 'WI'},
            { name: 'WYOMING', abbreviation: 'WY' }
        ];
        return usStates;
    }
});

