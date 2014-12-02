
/* JavaScript content from js/lib/ibm-api-management/js/common/APIManager.js in folder common */
define(["Q"],/** @lends */function(Q){

	/**
	 * This class acts as a facade to call RESTful services hosted on IBM API management https://w3.apihub.ibm.com/
	 * @class
	 * @param {String} organization - the API provider organization (e.g. common)
	 * @param {String} environment - the API Environment (e.g. run)
	 * @param {String} apiName - the service context of the API you are calling.  e.g. https://w3.api.ibm.com/ibmstock would have serviceRoot set to ibmstock
	 */
	function APIManager(organization,environment,apiName){
		// This first guard ensures that the callee has invoked our Class' constructor function
        // with the `new` keyword - failure to do this will result in the `this` keyword referring 
        // to the callee's scope (typically the window global) which will result fields
        // leaking into the global namespace and not being set on this object.
        if (!(this instanceof APIManager)) {
            throw new TypeError("APIManager constructor cannot be called as a function.");
        }//end if
        
        this.organization = organization;
        this.environment = environment;
        this.apiName = apiName;
        
        this.serviceContext = this.organization + "/" + this.environment + "/" + this.apiName;
	};
	
	APIManager.prototype = {
			
			constructor: APIManager,
			
			/**
			 * Performs GET on the given path. e.g. APIManager.get("quote") evaluates to https://w3.api.ibm.com/ibmstock/quote if serviceContext is ibmstock
			 * @param {String} path - path of the service method to call
			 * @param {object} params - optional request parameters as name: value: pairs
			 * @returns {Promise} invocation result of service call
			 */
			get: function(path,params){
				return this._commonCall("get",[this.serviceContext,path,params]);
			},
			
			/**
			 * Performs POST on the given path.  Usually used to create a new entity.
			 * @param {String} path - path of the service method to call
			 * @param {object} params - optional request parameters as name: value: pairs
			 * @param {object} data - the data to POST in the request body
			 * @returns {promise} invocation result of service call
			 */
			post: function(path,params,data){
				return this._commonCall("post",[this.serviceContext,path,params,data]);
			},
			
			/**
			 * Performs DELETE on the given path. Usually used to delete an existing entity.
			 * @param {String} path - path of the service method to call
			 * @param {object} params - optional request parameters as name: value: pairs
			 * @returns {Promise} invocation result of service call
			 */
			remove: function(path,params){	
				return this._commonCall("remove",[this.serviceContext,path,params]);
			},
			
			
			/**
			 * Performs PUT on the given path. Usually used to update an existing entity.
			 * @param {String} path - path of the service method to call
			 * @param {object} params - optional request parameters as name: value: pairs
			 * @param {object} data - the data to PUT in the request body
			 * @returns {Promise} invocation result of service call
			 */
			put: function(path,params,data){
				return this._commonCall("put",[this.serviceContext,path,params,data]);
			},
			
			/**
			 * Private method that calls the IBMAPIManagementAdapter Worklight adapter method
			 * @param {String} procedure - the procedure to call
			 * @param {Object[]} parameters - parameters to pass to Worklight Adpater
			 */
			_commonCall: function(procedure,parameters){
				var def = Q.defer();
				var data = {
						adapter: "IBMAPIManagementAdapter",
						procedure: procedure,
						parameters: parameters
				};
				var options = {
					onSuccess: function(result){
						def.resolve(result.invocationResult);
					},
					onFailure: function(err){
						console.error("Error calling IBMAPIManagementAdapter",err);
						def.reject(err);
					}
				};
				
				WL.Client.invokeProcedure(data,options);
				return def.promise;
			}
	};
	
	//Return the class
	return APIManager;
	
});