var fanApp = angular.module('fanApp', ['ngRoute', 'ngAnimate']);

var manMail = new mandrill.Mandrill('rYwkbK4FxF85oX2tkVihXQ');

Parse.initialize("6BDeNGgmLDMe8UOcmWjIXxSjGJnjjdV6rxbA6NOn", "uGMBTBgVzqWYwohD5O5YgtjOBWub7TcEZGT422nO");

fanApp.config(function($routeProvider) {
    $routeProvider  
        .when('/', {
                templateUrl: 'pages/splash.html',
                controller  : 'splashController',
                bodyStyle: 'light',
                bodyBG: 1,
                bodyRepeat: 'no-repeat'
        })

        .when('/home', {
                templateUrl : 'pages/fanHome.html',
                controller  : 'homeController',
                bodyStyle: 'light',
                bodyBG: 1,
                bodyRepeat: 'repeat',
                callMenu: '#home3'
        })

        .when('/spotlight', {
            templateUrl: 'pages/spotlight.html',
            controller: 'spotController',
            bodyStyle: 'dark',
            bodyBG: 1,
            bodyRepeat: 'no-repeat',
            callMenu: '#spot2'
        })

        .otherwise({redirectTo: '/home'});
});

fanApp.run( ['$rootScope', '$routeParams', '$location', '$route', function($scope, $routeParams, $location, $route) {
    
    var darkBG = ['#484848', 'url(/images/gradient_blue.jpg)', 'url(/images/football_field2_1300.jpg)', 'url(/images/neutral_green.png)', 'url(/images/green_leather.png)', 'url(/images/nyj_spirals.jpg)'];
    var lightBG = ['#fff','url(/images/jets_dlineBW2.jpg)', 'url(/images/halftone.png)', 'url(/images/diamond_wall_white.jpg)'];
    
    $scope.$on('$routeChangeStart', function(e, next, current) { 

        if(next.bodyStyle == 'dark'){
            if(next.bodyBG == 0){
                $("body").css('background',darkBG[0]);
            }else{
                $("body").css('background-image', darkBG[next.bodyBG]);
                $("body").css('background-repeat',next.bodyRepeat);
                $("body").css('background-attachment','fixed');
                $("body").css('background-size','cover');
            }
        }else{
            if(next.bodyBG == 0){
                $("body").css('background',lightBG[0]);
            }else{
                $("body").css('background-image', lightBG[next.bodyBG]);
                $("body").css('background-repeat',next.bodyRepeat);
                $("body").css('background-attachment','fixed');
                $("body").css('background-size','cover');
            }
        }

    });

    $scope.$on('$routeChangeSuccess', function(e, current) { 
     
        if(current.controller == 'homeController'){
            $scope.menuLink = 1;
            $scope.hideMenu = true;
        }else if(current.controller == 'spotController'){
            $scope.menuLink = 2;
        }else{
            $scope.menuLink = 3;
        }

        if(current.controller != 'homeController'){
            $scope.hideMenu = false;
        }

        $( window ).load(function() {
            $("menu").css('border-top','solid 4px #5CE65C');
        });

    });

}]);

fanApp.controller('bodyController', function($scope, $location, $route, $routeParams){
    if($routeParams.controller != 'homeController'){
        $("#main").css('padding-top','75px');
    }else{
        $("#main").css('padding-top', '0px');
    }
    
});

fanApp.controller('splashController', function($scope, $location, $route){
    $scope.splash = true;
});

fanApp.controller('homeController', function($scope, $location, $route, $timeout, $window){

    $scope.callElem = $("#home3").position().top;

    $scope.slides = [
        {
            header: 'The Blog',
            text: 'Check out the latest entries in the Fanalytik Blogosphere',
            linkType: 2,
            link: 'http://fanalytik.co/blog/',
            index: 1
        },
        {
            header: 'Spotlight',
            text: 'Who is in the spotlight this week? Check out our highlight blog of the elite and the up and coming.',
            linkType: 1,
            link: '#spotlight',
            index: 2
        },
        {
            header: 'Online Polls',
            text: 'Let your voice be heard on the latest topics in sports.',
            link: 'http://fanalytik.co/blog/category/poll/',
            linkType: 2,
            index: 3
        },
        {
            header: 'Fans Take',
            text: 'Take a look at the latest in NFL fan chatter in our tweet-based articles',
            link: 'http://fanalytik.co/blog/category/fans-take/',
            linkType: 2,
            index: 4
        },
        {
            header: 'World Cup 2014',
            text: 'The World Cup is coming soon, starting on June 12th! Check out the group tables this year.',
            linkType: 2,
            index: 5
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

    var headlineEngine = 0;

    var headlineIdx = 0;

    var headlines = [
        "Chelsea reportedly purchase Atletico Madrid striker, Diego Costa for $53 Million.",
        "Jets sign rookie S Calvin Pryor."
    ];

    //$scope.headline = headlines[0];

    $scope.nextHeadline = function(){
        $timeout.cancel(headlineEngine);
        $("#headline").animate({left: -9999});
        if(headlineIdx == headlines.length-1){
            headlineIdx = 0;
        }else{
            headlineIdx++;
        }
        $scope.headline = headlines[headlineIdx];
        $("#headline").animate({left: 0});
        headlineEngine = $timeout($scope.nextHeadline, 7500);
    }

    $scope.prevHeadline = function(){
        $timeout.cancel(headlineEngine);
        $("#headline").animate({left: -9999});
        if(headlineIdx == 0){
            headlineIdx = headlines.length-1;
        }else{
            headlineIdx--;
        }
        $scope.headline = headlines[headlineIdx];
        $("#headline").animate({left: 0});
        headlineEngine = $timeout($scope.nextHeadline, 7500);
    }

    $scope.nextHeadline();

    $scope.articles = [
        {
            title: "The Danger of the Limited Mindset",
            date: "6/1/14",
            blurb: "What can the Jets learn from the Indiana Pacers?",
            link: 'http://wp.me/p4Dlup-6p',
            image: '/images/rexryan.jpg'
        },
        {
            title: "Player Analysis: Jalen Saunders",
            date: "5/21/14",
            blurb: "The NFL Outlook for the rookie from Oklahoma",
            link: 'http://wp.me/p4Dlup-6f',
            image: '/images/jalensaunders_2.jpg'
        },
        {
            title: "Player Analysis: Jace Amaro",
            date: "5/19/14",
            blurb: "How will Amaro fair in the NFL?",
            link: 'http://wp.me/p4Dlup-5R',
            image: '/images/jaceamaro_1.jpg'
        },
        {
            title: "Jets Draft Poll 2014",
            date: "5/15/14",
            blurb: "What are your thoughts on the Jets 2014 draft picks?",
            link: 'http://wp.me/p4Dlup-5E',
            image: '/images/calpryor.jpg'
        }
    ];

});


fanApp.controller('spotController', function($scope, $location, $route, $sce){
    $scope.callElem = $("#spot2").position().top;

    $scope.splash = false;
    $scope.hash = "";
    $scope.videos = [
        {
            id: "v1",
            name: "Video 1",
            date: "05/28/14",
            caption: "This is video 1.",
            link: "https://www.youtube.com/embed/rc_M_g72V8Y"
        },
        {
            id: "v2",
            name: "Video 2",
            date: "05/29/14",
            caption: "This is video 2.",
            link: "https://www.youtube.com/embed/nMiHAZe7gpY"
        }
    ]; 

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.vidCount = 3;

    $scope.morePosts = function(){
        vidCount = vidCount + 3;
    }

    $scope.hasMorePosts = function(){
        if($scope.vidCount >= $scope.videos.length){
            return false;
        }else{
            return true;
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

