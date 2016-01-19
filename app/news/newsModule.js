

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
  return {
    
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
.factory('serviceSharedData', function() {

      var savedData = {}
      function set(data) {
       savedData = data;
      }
         function get() {
           return savedData;
       }

          return {
             set: set,
             get: get
    }
       
})
.controller('NewsCtrl', ['$scope', 'Auth', '$location',function ($scope, Auth ,$location) {
  

	$scope.loggedIn = Auth.isLoggedIn;
  $scope.token = Auth.token;

   $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {

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
.controller('NewsDataCtrl', ['$scope','$http', 'Auth', 'NewsData', 'Constants',  '$location',  function ($scope , $http, Auth, NewsData, Constants , $location ) {

     console.log("NewsDataCtrl scope: " + $scope)
     var baseUrl = Constants.getBaseUrl();
     console.log("Base url: " + baseUrl);

     $scope.numberOfGalleryImages = 0 ;


       $scope.reset = function() {
       
         location.reload();

     };

  
     $scope.submitNews = function() {

         console.log("sumitNews scope: " + $scope)

         console.log("news in newsData: " + $scope.news)
        
         var newsData=$scope.news;  

         $scope.NewsDataForm.$setPristine(true);   

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
          .success(function(response) {
                 
             if(response.errors) {
                  console.log("response error: " + $response.errors.name)
                   $scope.errorNews = response.errors.newsData;
                   $scope.errorMsg = "News not submitted!! Try again!";
             } else {

                  $scope.successMsg = "Successfully Submitted";
             }   

          })
          .error(function (data , status , headers, config) {
                $scope.errorMsg = "News not submitted!! Try again!!";
          });
     }
   
}])
.directive('addInput', ['$compile', function ($compile) { // inject $compile service as dependency
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // click on the button to add new input field
            element.find('button').bind('click', function () {
                // I'm using Angular syntax. Using jQuery will have the same effect
                // Create input element

                console.log("add input")


                var input = angular.element('<div class="form-group"> <label for="InputGalleryImageUrl" class="col-sm-3">Gallery Image URL</label><div class="col-sm-6"> <input type="url" class="form-control" id="InputGalleryImageUrl"  name="InputGalleryImageUrl" placeholder="Enter GalleryImage URL"  ng-model="news.galleryImages[' + scope.numberOfGalleryImages + '].url"></div></div><div class="form-group"><label for="InputGalleryImageDescription" class="col-sm-3">Gallery Image Description</label><div class="col-sm-9"><textarea class="form-control" id="InputGalleryImageDescription" name="InputGalleryImageDescription" placeholder="GalleryImage Description" ng-model="news.galleryImages[' + scope.numberOfGalleryImages + '].description"></textarea></div></div>');

                // Compile the HTML and assign to scope
                var compile = $compile(input)(scope);

                // Append input to div
                element.append(input);

                // Increment the counter for the next input to be added
                scope.numberOfGalleryImages++;
            });
        }
    }
}])
.controller("HomeCtrl", ["$scope", 'NewsData', '$http', 'Constants', '$location', 'serviceSharedData', function ($scope, NewsData, $http, Constants, $location, serviceSharedData ) {

   
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
    };

  // $scope.$watch('searchStr', function (search)
  //   {
  //     console.log(search);
  //     if (!search || search.length == 0)
  //       return 0;
  //       // if searchStr is still the same..
  //       // go ahead and retrieve the data
  //       if (search === $scope.searchStr)
  //       {
  //         $http.get("http://ec2-52-27-107-78.us-west-2.compute.amazonaws.com:8080/news?search=" + search).success(function(data) {
         
  //           $scope.responseData = data; 

  //         });
  //       }
  //   });

      $scope.editNews = function (news) {

        serviceSharedData.set(news);

        $location.url('/newsFormUpdate');

      }

}])

.controller('UpdateCtrl', ['$scope', '$http','Auth', 'Constants' , 'serviceSharedData' , function ($scope, $http, Auth, Constants ,serviceSharedData) {

    var baseUrl = Constants.getBaseUrl();

     $scope.news = serviceSharedData.get();

     $scope.updateNews = function() {

       $scope.news = serviceSharedData.get();

      var updatedNews = $scope.news;

      var accesstoken = Auth.token();

       $scope.NewsDataForm.$setPristine(true);   

      $http({
              method : 'PUT',
              url    :  baseUrl + '/news/{id}',
              data    : updatedNews,   
              headers :  {'Content-Type': 'application/json',
                          'Authorization': "Bearer " + accesstoken
                         }
            })

          .success(function(response) {
                 
             if(response.errors) {
                  console.log("response error: " + $response.errors.name)
                   $scope.errorNews = response.errors.updatedNews;
                   $scope.errorMsg = "News not submitted!! Try again!";
             } else {

                  $scope.successMsg = "Successfully Submitted";
             }   

          })
          .error(function (data , status , headers, config) {
                $scope.errorMsg = "News not submitted!! Try again!!";
          });
                  
      }  
}])


.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', 'Constants' , function ($scope, $http , $location , Auth, Constants) {

	   var baseUrl = Constants.getBaseUrl();


	   console.log("scope is: " + $scope)


	   $scope.submitLogin = function() {


     $scope.LoginForm.$setPristine();

      
		 console.log('in submitLogin');

  		var formdata = "username=" + $scope.user.username + "&password=" + $scope.user.password + "&grant_type=password&scope=read+write&client_secret=123456&client_id=clientapp";
  		
  		 $http({
            method  : 'POST',
            url     : baseUrl + '/oauth/token',
            data    : formdata,
            headers : {'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization' : "Basic Y2xpZW50YXBwOjEyMzQ1Ng==",
                        'Accept' : 'application/json'
                      }
           })
            .success(function(response) {
            	console.log('response' + response);
              if (response.errors) {
              console.log("response error: " + $response.errors.name)
                $scope.errorName = response.errors.name;                
                $scope.errorUserName = response.errors.username;
                $scope.errorEmail = response.errors.email;
                $scope.errorMsg = "Authentication Failed";
              } else {
                Auth.setAccessToken(response.access_token)
                 $location.url('/home');
                 $scope.successMsg = "Successfully Login";
              }
            })
            .error(function (data, status, headers, config) {

                 $scope.errorMsg = "Invalid Username and password";
                // TODO
                console.log("response error: " + $response.errors.name)
            });
          };
	
     }]);

})();