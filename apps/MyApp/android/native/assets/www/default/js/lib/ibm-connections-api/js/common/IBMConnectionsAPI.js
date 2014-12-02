
/* JavaScript content from js/lib/ibm-connections-api/js/common/IBMConnectionsAPI.js in folder common */
define(["Q"],function(Q){
	
	/**
	 * This class acts as a facade to call RESTful services hosted on IBM Connections API https://w3-connections.ibm.com//common/opensocial/basic/rest/ublog/
	 * @module ibm-connections-api/common/IBMConnectionsAPI
	 */
	
	/**
	 * IBMConnectionsAPI Constructor
	 */
	function IBMConnectionsAPI(){
		// This first guard ensures that the callee has invoked our Class' constructor function
        // with the `new` keyword - failure to do this will result in the `this` keyword referring 
        // to the callee's scope (typically the window global) which will result fields
        // leaking into the global namespace and not being set on this object.
        if (!(this instanceof IBMConnectionsAPI)) {
            throw new TypeError("IBMConnectionsAPI constructor cannot be called as a function.");
        }//end if
        
	};
	
	IBMConnectionsAPI.prototype = {
			
			constructor: IBMConnectionsAPI,
			
			/**
			 * 
			 */
			postStatus: function(statusMsg, base64uid){
				return this._commonCall("postStatus",[statusMsg, base64uid]);
			},
			
			/**
			 * Private method that calls the Connections Worklight adapter method
			 * @param {String} procedure - the procedure to call
			 * @param {Object[]} parameters - parameters to pass to Worklight Adpater
			 */
			_commonCall: function(procedure,parameters){
				var def = Q.defer();
				var data = {
						adapter: "Connections",
						procedure: procedure,
						parameters: parameters
				};
				var options = {
					onSuccess: function(result){
						def.resolve(result.invocationResult);
					},
					onFailure: function(err){
						console.error("Error calling Connections adapter",err);
						def.reject(err);
					}
				};
				
				WL.Client.invokeProcedure(data,options);
				return def.promise;
			}
	};
	
	//Return the class
	return IBMConnectionsAPI;
	
});