
/* JavaScript content from commonapp/controllers/LoginView.js in folder common */
define(["i18n!../nls/LoginView"],function(text){
	
	/**
	 * Controls the login view
	 * @class
	 * @memberof commonapp
	 */
	function LoginView($scope,$log,$state,$stateParams,$ionicSideMenuDelegate){
		
		//Disable dragging of side menu when in login view
		$ionicSideMenuDelegate.canDragContent(false);
		
        $scope.text = text;
        $scope.credentials = {username: "",password: ""};
        $scope.loginErrorMsg = $stateParams.loginErrorMsg;
        
        //Prefill the username
        /**
         * Handles the login button click.  It will direct to the home view if the user is already authenticated in the 
         * ServicesRealm, otherwise it will attempt to submit the login credentials to the ibm-auth module via a resolve() on the 
         * deferred that is available on the root scope @see commonapp/home/AppCtrl.js
         */
        function clickLogin(){
        		$log.debug("Submitting login");
        		$state.go("app.home",{},{reload: true});
        }
        
        
        //Connect the action handlers to view
        $scope.clickLogin = clickLogin;
	}
	
	return ["$scope",
	        "$log",
	        "$state",
	        "$stateParams",
	        "$ionicSideMenuDelegate",LoginView];
});