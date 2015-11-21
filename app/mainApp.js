angular.module('mainApp', ['newsModule','ngRoute','ui.router'])
.config(['$urlRouterProvider','$stateProvider',
  function($urlRouterProvider,$stateProvider) {

    $stateProvider
        .state("home", {

          url: "/home",
          templateUrl: 'home.html'

        })
        
        .state("login", {

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

	console.log("Run hook");
}])
.controller('ContactCtrl', ['$scope', function ($scope) {
	
	
}])
