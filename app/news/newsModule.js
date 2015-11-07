

(function(){

angular.module('newsModule', ['ngStorage'])
.factory([function () {	

}])

.config([function () {
	console.log("News Module:: config");
}])
.run([function () {
	console.log("News Module::running");
}])
.controller('NewsCtrl', [function () {
	
}])
.controller('NewsDataCtrl', ['$scope','$http',function ($scope , $http , $localStorage) {

  var baseUrl = "http://ec2-52-27-107-78.us-west-2.compute.amazonaws.com:8080"
           
    $scope.submitNews = function() {

         var newsData=$scope.news;
         var accesstoken = $localStorage.access_token;

         console.log("access_token: " + accesstoken)

                 
     $http({
          method  : 'POST',
          url     :  baseUrl + '/news',   
          data    :  newsData,
          headers :  {'Content-Type': 'application/json',
                      'Authorization': "Bearer " + accesstoken
                     }                             
           })
    }  
}])

.controller('LoginCtrl', ['$scope', '$http', '$location', '$localStorage' ,function ($scope, $http , $location , $localStorage ) {

	var baseUrl = "http://ec2-52-27-107-78.us-west-2.compute.amazonaws.com:8080"

	console.log("scope is: " + $scope)
	$scope.submitLogin = function() {

		console.log('in submitLogin');

  		var formdata = "username=" + $scope.user.username + "&password=" + $scope.user.password + "&grant_type=password&scope=read+write&client_secret=123456&client_id=clientapp";
  		
  		 $http({
            method  : 'POST',
            url     : baseUrl + '/oauth/token',
            data    : formdata, //forms user object
            headers : {'Content-Type': 'application/x-www-form-urlencoded',
                          'Authorization' : "Basic Y2xpZW50YXBwOjEyMzQ1Ng==",
                          'Accept' : 'application/json'
                      }
           })
            .success(function(response) {
            	console.log('response' + response);
              if (response.errors) {
              console.log("response error: " + $response.errors.name)
                // Showing errors.
                $scope.errorName = response.errors.name;                
                $scope.errorUserName = response.errors.username;
                $scope.errorEmail = response.errors.email;
              } else {
                //$scope.access_token = response.access_token;
                //$scope.refresh_token = response.refresh_token;
                 $localStorage.access_token = response.access_token;
                 $localStorage.refresh_token = response.refresh_token;
                 $location.url('/newsForm');
                 console.log("access_token: " + $localStorage.access_token,
                	        "refresh_token: " + $localStorage.refresh_token)
              }
            })
            .error(function (data, status, headers, config) {
                // TODO
                console.log("response error: " + $response.errors.name)
            });
          };
	
}])

})();