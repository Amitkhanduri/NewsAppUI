

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

.factory('Auth', function($localStorage){
return{
    setAccessToken : function(the_access_token){
        $localStorage.access_token = the_access_token;
    },
    isLoggedIn : function(){
      console.log("isLoggedIncalle");
      access_token = $localStorage.access_token
        return(access_token)? true : false;
    },
    token : function() {
      
      access_token = $localStorage.access_token
      console.log("token called: " + access_token);
        return access_token
    }, 
    logout : function() {
      $localStorage.access_token = null;
    }
  }
})
.controller('NewsCtrl', ['$scope', 'Auth', function ($scope, Auth) {

  console.log("scope in news controller: " + $scope)
  

	$scope.loggedIn = Auth.isLoggedIn;
  $scope.token = Auth.token;

  console.log("looggeinin in news controller: " + $scope.loggedIn())

   $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

    //console("old logged in: " + oldValue + ", new " + value)

    $scope.loggedIn = Auth.isLoggedIn
    $scope.token = Auth.token

    if(!value && oldValue) {
      console.log("Disconnect as logged in is false");
    }

    if(value) {
      console.log("Connect as loggedin is true");
      //Do something when the user is connected
    }

  }, true);

   $scope.logoutClicked = function() {
    console.log("logout clicked");
      Auth.logout()
   }

}])
.controller('NavCtrl', ['$scope', '$location' , '$localStorage' , '$window', '$ionicHistory' ,function($scope, $location, $localStorage, $window, $ionicHistory){

      $scope.logout = function($scope) {

                 $window.localStorage.clear();
                 $ionicHistory.clearCache();
                 $ionicHistory.clearHistory();

       };
  

}])
.controller('NewsDataCtrl', ['$scope','$http','$localStorage',function ($scope , $http , $localStorage) {

  var baseUrl = "http://ec2-52-27-107-78.us-west-2.compute.amazonaws.com:8080"
           
    $scope.submitNews = function($scope) {


         var newsData=$scope.news;
         var galleryImage = $scope.galleryImage;  

         var galleryImages = [galleryImage];
         newsData.galleryImages = galleryImages;

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
.controller('LoginCtrl', ['$scope', '$http', '$location', "Auth" ,function ($scope, $http , $location , Auth ) {

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
                Auth.setAccessToken(response.access_token)
                 $location.url('/newsForm');
              }
            })
            .error(function (data, status, headers, config) {
                // TODO
                console.log("response error: " + $response.errors.name)
            });
          };
	
}])

})();