
/* JavaScript content from commonapp/config.js in folder common */
/** @namespace commonapp */
define([],function(){
	
	/**
	 * This is where the app's routes/states are defined.  This example has one state - the home view.
	 * To better understand all of the advanced options for transitioning between views and sub-views in your app see ui.router docs linked to below 
	 * @see https://github.com/angular-ui/ui-router 
	 * @class
	 * @memberof commonapp
	 */
	function config($stateProvider,$urlRouterProvider){
		//Define the app's states
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "commonapp/templates/MenuTemplate.html",
                controller: "commonapp/controllers/AppCtrl"
            })

            .state('app.home',{
                url: "/home",
                views: {
                    'menuContent' :{
                        templateUrl: "commonapp/templates/HomeView.html",
                        controller: "commonapp/controllers/HomeView"
                    }
                }

            })
            
            .state('app.login',{
                url: "/login",
                views: {
                    'menuContent' :{
                        templateUrl: "commonapp/templates/LoginView.html",
                        controller: "commonapp/controllers/LoginView"
                    }
                }

            });

        	 $urlRouterProvider.otherwise("/app/login");
    	
    }
    
    return ["$stateProvider",
            "$urlRouterProvider",config];
});
