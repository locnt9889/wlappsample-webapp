
/* JavaScript content from commonapp/controllers/HomeView.js in folder common */
define(["i18n!../nls/HomeView"],function(text){
	
	/**
	 * Home view controller
	 * @class
	 * @memberof commonapp
	 */
	function HomeView($scope,$ionicSideMenuDelegate){
		
		//Enable dragging of side menu when in login view
		$ionicSideMenuDelegate.canDragContent(true);
        $scope.text = text;
		
	}
	
	return ["$scope",
	        "$ionicSideMenuDelegate",HomeView];
});