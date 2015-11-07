

(function(){

angular.module('newsModule', [])
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
.controller('NewsDataCtrl', ['$scope','$http',function ($scope , $http) {
           
    $scope.submitNews = function() {

      var newsData = {
                      "title": "Modi",
                      "shortDescription":"Prime Minister of India",
                      "body": "India",
                      "sourceUrl": "http://www.thehindu.com/multimedia/dynamic/01938/Modi_1938656f.jpg",
                      "videoUrl": "http://www.thehindu.com/multimedia/dynamic/01938/Modi_1938656f.jpg",
                      "category": {
                              "name": "India"
                      },
                     "featuredImage": {
                              "url": "http://www.thehindu.com/multimedia/dynamic/01938/Modi_1938656f.jpg",
                              "description": "Hindu"
                      },
                     "galleryImages": [
                          {
                      "url": "http://www.thehindu.com/multimedia/dynamic/01938/Modi_1938656f.jpg",
                      "description": "the Hindu"
                      },
                      {
                      "url": "http://www.thehindu.com/multimedia/dynamic/01938/Modi_1938656f.jpg",
                      "description": "Namo Namo"
                       }
                      ]
                   };
                 
     $http({
          method  : 'POST',
          url     :  baseUrl + '/news',
          data    :  JSON.stringify(newsData),    
          headers :  {'Content-Type': 'application/json',
                      'Authorization': "Bearer access_token"
                     }                             
           })
    }  
}])

.controller('LoginCtrl', ['$scope', '$http', '$location',function ($scope, $http , $location) {

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
                $scope.access_token = response.access_token;
                $scope.refresh_token = response.refresh_token;
                $location.url('/newsForm');
                console.log("access_token: " + $scope.access_token,
                	        "refresh_token: " + $scope.refresh_token)
              }
            })
            .error(function (data, status, headers, config) {
                // TODO
                console.log("response error: " + $response.errors.name)
            });
          };
	
}])

})();