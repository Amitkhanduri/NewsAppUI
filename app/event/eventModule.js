

(function(){

angular.module('eventModule', [])
.factory([function () {	

}])

.config([function () {
	console.log("Event Module:: config");
}])
.run([function () {
	console.log("Event Module::running");
}])
.controller('EventCtrl', [function () {
	var baseUrl = "http://localhost:8111";
	
	
}])

})();