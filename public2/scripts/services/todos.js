angular.module('mainService', [])

	// super simple service
	// each function returns a promise object 

	.factory('User', ['$http', '$q',function($http, $q) {
		return {
			getall : function() {
				return $http.get('/api/auth/all');
			},
			authenticate: function(user){
				// return $http.post('/api/auth/me');
				var deferred = $q.defer();
	            $http({
	                method: 'GET',
	                url: '/api/auth/me',
	                headers: {
   						'Content-Type': 'application/json',
   						'x-access-token': user.token
 					}
	            })
	            .success(function (data) { deferred.resolve(data); })
	            .error(function (error) { deferred.reject(error); });
	            return deferred.promise;
			},
			update : function(user) {
				return $http.put('/api/auth/update', user);
			},
			login : function(user) {
				// return $http.post('/api/auth/login', user);
				var deferred = $q.defer();
	            $http({
	                method: 'POST',
	                url: '/api/auth/login',
	                data : user
	            })
	            .success(function (data) { deferred.resolve(data); })
	            .error(function (error) { deferred.reject(error); });
	            return deferred.promise;
			},
			register : function(user) {
				// return $http.post('/api/auth/register', user);
				var deferred = $q.defer();
	            $http({
	                method: 'POST',
	                url: '/api/auth/register',
	                data : user
	            })
	            .success(function (data) { deferred.resolve(data); })
	            .error(function (error) { deferred.reject(error); });
	            return deferred.promise;
			}
		}
	}])

	.factory('Post', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/post');
			},
			getOne : function(id) {
				return $http.get('/api/post/' + id);
			},
			create : function(data) {
				return $http.post('/api/post', data);
			},
			delete : function(id) {
				return $http.delete('/api/post/' + id);
			},
			update : function(id, data) {
				return $http.put('/api/post/'+id, data);
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

	.factory('Tag', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/tag');
			},
			create : function(data) {
				return $http.post('/api/tag', data);
			}
		}
	}]);