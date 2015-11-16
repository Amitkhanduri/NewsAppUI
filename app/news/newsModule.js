

(function(){

angular.module('newsModule', ['ngStorage', 'angularUtils.directives.dirPagination'])
.factory([function () {	

}])

.config([function () {
	console.log("News Module:: config");
}])
.run([function () {
	console.log("News Module::running");
}])
.factory('Constants', function() {
  return {
    getBaseUrl: function() {
        var baseUrl = "http://ec2-52-27-107-78.us-west-2.compute.amazonaws.com:8080"
        return baseUrl;
    }
  }

  })
.factory('Auth', function($localStorage){
return{
    setAccessToken : function(the_access_token){
      $localStorage.access_token = the_access_token;
    },
    isLoggedIn : function(){
      access_token = $localStorage.access_token
      return(access_token)? true : false;
    },
    token : function() {
      access_token = $localStorage.access_token
      return access_token
    }, 
    logout : function() {
      $localStorage.access_token = null;
    }
  }
})
.factory('NewsData', function() {
  var pagination = { "numberOfPages" : 0, "perPage" : 5, "pageNumber" : 0};
  var newsData = [];
return{
    
    addNews : function(the_pagination, the_newsData) {
        pagination = the_pagination;
        newsData = the_newsData;
        //newsData.push.apply(newsData, the_newsData)
        // Array.prototype.push.apply(newsData, the_newsData); // http://stackoverflow.com/questions/351409/appending-to-array

        console.log("setNews: pageNumber" + pagination.pageNumber)
        console.log("setNews: perPage" + pagination.perPage)

        console.log("setNews: numberOfPages" + pagination.numberOfPages)

    },
    getNews : function () {
      return newsData;
    },
    getPagination : function () {
      return pagination;
    },

    getTotalItems : function() {
      totalItems = pagination.numberOfPages * pagination.perPage;
      return totalItems;
    }
  }
})
.controller('NewsCtrl', ['$scope', 'Auth', '$location',function ($scope, Auth ,$location) {
  

	$scope.loggedIn = Auth.isLoggedIn;
  $scope.token = Auth.token;

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
      $location.url('/home');
   }

}])
.controller('NewsDataCtrl', ['$scope','$http', 'Auth', 'NewsData', function ($scope , $http, Auth, NewsData ) {

  console.log("NewsDataCtrl scope: " + $scope)

  
           
    $scope.submitNews = function() {

        console.log("sumitNews scope: " + $scope)

         console.log("news in newsData: " + $scope.news)
        
         var newsData=$scope.news;
         var galleryImage = $scope.galleryImage;  

         var galleryImages = [galleryImage];
         newsData.galleryImages = galleryImages;

         var accesstoken = Auth.token();

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

.controller("HomeCtrl", ["$scope", "NewsData", '$http', 'Constants', function ($scope, NewsData, $http, Constants) {
//   $scope.title = "TITLE"
// }])
// .controller('HomeCtrl', ['NewsData', '$scope', function ($scope, $NewsData) {

  $scope.title = "These are the news:"
  var baseUrl = Constants.getBaseUrl();

  $scope.newsList = NewsData.getNews;  
  $scope.perPage = NewsData.getPagination().perPage;
  $scope.currentPage = NewsData.getPagination().pageNumber + 1;
  $scope.totalItems = NewsData.getTotalItems;

  var myNewsList = $scope.newsList
  console.log("newsList size: " + myNewsList.length )

  $scope.pageChanged = function(newPage) {
    console.log("pageChanged: " + newPage - 1)
    $scope.getNews(newPage - 1);
  }

  $scope.getNews = function(pageNumber) {

     console.log("getNews called for page:" + pageNumber)
     var newsData=$scope.news;
     var galleryImage = $scope.galleryImage;  

     var galleryImages = [galleryImage];
     newsData.galleryImages = galleryImages;


                 
     $http({
          method  : 'GET',
          url     :  baseUrl + '/news', 
          params  : {page_number: pageNumber, per_page: NewsData.getPagination().perPage}, 
          data    :  newsData,
          headers :  {'Content-Type': 'application/json'
                     }                             
           })
          .success(function(response) {
              
              NewsData.addNews(response.metadata, response.content)

              $scope.newsList = NewsData.getNews;  
              $scope.perPage = NewsData.getPagination().numberOfPages;
              $scope.currentPage = NewsData.getPagination().pageNumber + 1;
              $scope.totalItems = NewsData.getTotalItems;



              console.log("newsdata: " + $scope.newsList());
              var length = $scope.newsList().length
              console.log("newsList size after fetch: " + length  + "totalItems: " + $scope.totalItems())
          })
    } 

}])
.controller('LoginCtrl', ['$scope', '$http', '$location', "Auth", "Constants" ,function ($scope, $http , $location , Auth, Constants ) {

	var baseUrl = Constants.getBaseUrl();

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