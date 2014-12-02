define(["i18n!../nls/HomeView",
        "i18n!../nls/common"],function(text,commonText){
	
	/**
	 * This is the global app controller.  Here you can place functions that are accessible to all other views
	 * @class
	 * @memberof commonapp
	 */
	function AppCtrl($rootScope,$scope,$state){
		//translations
		$scope.text = text;
		$scope.commonText = commonText;
		console.debug("App controller loading");
		
	}
	
	return ["$rootScope",
	        "$scope",
	        "$state",AppCtrl];
});