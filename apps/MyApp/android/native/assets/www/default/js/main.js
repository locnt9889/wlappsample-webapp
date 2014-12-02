
/* JavaScript content from js/main.js in folder common */
function wlCommonInit(){
	/*
	 * Use of WL.Client.connect() API before any connectivity to a Worklight Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */
	
    require(["ibm-auth/common/ngLoader",
            "text!commonapp/ngconfig.json"],function(loader,json){
        var o = JSON.parse(json);
        loader.config(o).then(function(){
            try{
                angular.bootstrap(document,["commonapp"]);
                console.debug("bootstrap complete");
            }catch(e){
                console.debug(e);
            }//end try
        });
    });


	
}

/* JavaScript content from js/main.js in folder android */
// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}