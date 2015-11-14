/*Angular Modules take a name, best practice is lowerCamelCase, and a list of dependancies*/
/*added the second module as a dependancy */
angular.module('mainApp', ['newsModule','ngRoute','ui.router'])
.config(['$urlRouterProvider','$stateProvider',
  function($urlRouterProvider,$stateProvider) {

    $stateProvider
        .state("home", {

          // Use a url of "/" to set a states as the "index".
          url: "/home",
          templateUrl: 'home.html'

        })
        
        .state("login", {

          // Use a url of "/" to set a states as the "index".
          url: "/login",
          templateUrl: 'login.html'

        })

        .state("newsForm", {

             url: "/newsForm",
             templateUrl: 'newsForm.html'
        })

      

        $urlRouterProvider.when('', '/home');
   
  }])
.run([function () {
	/* Run is when the app gets kicked off*/
	console.log("Run hook");
}])
.controller('ContactCtrl', ['$scope', function ($scope) {
	
	
}])


// .controller('HomeCtrl', ['NewsData', '$scope', function ($scope, $NewsData) {

//   $scope.title = "These are the news:"

//   $scope.getNews = function() {

//      console.log("getNews called")
//      var newsData=$scope.news;
//      var galleryImage = $scope.galleryImage;  

//      var galleryImages = [galleryImage];
//      newsData.galleryImages = galleryImages;


                 
//      $http({
//           method  : 'GET',
//           url     :  baseUrl + '/news',   
//           data    :  newsData,
//           headers :  {'Content-Type': 'application/json'
//                      }                             
//            })
//           .success(function(response) {
//               NewsData.addNews(response.metadata, response.content)
//               console.log("newsdata: " + NewsData.getNews());
//           })
//     } 

// }])