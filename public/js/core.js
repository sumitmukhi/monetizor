var scotchTodo = angular.module('scotchTodo', ['todoController', 'todoService', 'ui.router', 'ngCookies']);


scotchTodo.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: '/views/landing.html'
        })

        .state('app', {
            url: "/app",
            templateUrl: '/views/common.html'
        })

        .state('app.post', {
            url: '/post',
            templateUrl: '/views/main.html'
        })

        .state('app.create', {
            url: '/post/create',
            templateUrl: '/views/create_post.html'
        })

        .state('app.dashboard', {
            url: '/dashboard',
            templateUrl: '/views/dashboard.html'
        });

});