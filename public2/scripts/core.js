var monetizor = angular.module('monetizor', ['homeController', 'mainService', 'ui.router', 'ngCookies']);


monetizor.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: '/views/login.html'
        })

        .state('register', {
            url: '/register',
            templateUrl: '/views/register.html'
        })


        .state('app', {
            url: "/app",
            templateUrl: '/views/common.html'
        })

        .state('app.post', {
            url: '/post/:postId',
            templateUrl: '/views/post.html'
        })

        .state('app.create', {
            url: '/create',
            templateUrl: '/views/create_post.html'
        })

        .state('app.dashboard', {
            url: '/dashboard',
            templateUrl: '/views/dashboard.html'
        })

        .state('app.profile', {
            url: '/profile',
            templateUrl: '/views/profile.html'
        })

        .state('app.admin', {
            url: '/admin',
            templateUrl: '/views/admin.html'
        })
});