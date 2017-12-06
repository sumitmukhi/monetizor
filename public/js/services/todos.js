angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			}
		}
	}])

	.factory('User', ['$http',function($http) {
		return {
			getall : function() {
				return $http.get('/api/user');
			},
			get : function(user) {
				return $http.post('/api/users', user);
			},
			getone : function(user) {
				return $http.post('/api/user', user);
			},
			create : function(user) {
				return $http.post('/api/user', user);
			},
			update : function(user) {
				return $http.put('/api/user', user);
			},
			authenticate : function(user) {
				return $http.post('/api/user/authenticate', user);
			},
			register : function(user) {
				// console.log("suer- -", user);
				return $http.post('/api/user/register', user);
			}
		}
	}])

	.factory('Post', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/post');
			},
			create : function(data) {
				return $http.post('/api/post', data);
			},
			delete : function(id) {
				return $http.delete('/api/post/' + id);
			},
			update : function(data) {
				return $http.put('/api/post', data);
			}
		}
	}])

	.factory('Share', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/share');
			},
			create : function(data) {
				return $http.post('/api/share', data);
			},
			getall : function() {
				return $http.get('/api/share/all');
			}
		}
	}])

	.factory('Tagged', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/tagged');
			},
			create : function(data) {
				return $http.post('/api/tagged', data);
			}
		}
	}]);