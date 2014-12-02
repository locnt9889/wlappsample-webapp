define(["ibm-auth/common/Logger"],function(Logger){
	
	/**
	 * This is the starting point of execution for the angular app.  Similar to dojo/onReady!
	 * @class
	 * @memberof commonapp
	 */
	function run($log){
		//Wraps the $log in Aspect Oriented Programming (AOP) style.  There is now a getLoggerInstance(context) available on $log
		//See commonapp/AppCtrl where var console = $log.getLoggerInstance(module.id) is used
		Logger($log);
	}
	
	return ["$log",run];
});