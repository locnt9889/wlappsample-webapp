
/* JavaScript content from js/lib/ibm-email-sender/js/common/SmtpMailManager.js in folder common */
define(["Q"],function(Q){
	
	/**
	 * This class acts as a facade to call SMTP Java Mail
	 * @module ibm-smtp-mail/common/SmtpMailManager
	 */
	
	/**
	 * SmtpMailManager Constructor
	 */
	function SmtpMailManager(){
		// This first guard ensures that the callee has invoked our Class' constructor function
        // with the `new` keyword - failure to do this will result in the `this` keyword referring 
        // to the callee's scope (typically the window global) which will result fields
        // leaking into the global namespace and not being set on this object.
        if (!(this instanceof SmtpMailManager)) {
            throw new TypeError("SmtpMailManager constructor cannot be called as a function.");
        }//end if
	};	
	
	SmtpMailManager.prototype = {
			
			constructor: SmtpMailManager,
			
			/**
			 * Performs sendMailUsingSMTP
			 * @param {String} path - path of the service method to call
			 * @param {object} params - optional request parameters as name: value: pairs
			 * @returns {Promise} invocation result of service call
			 */
			sendMailUsingSMTP: function(procedure, toEmail, subject, body){				
				return this.invokeSendEmailAdapter(procedure, ['enable@us.ibm.com',toEmail, subject, body]);
			},
			
			/**
			 * Private method that calls the SendEmailAdapter Worklight adapter method
			 * @param {String} procedure - the procedure to call
			 * @param {Object[]} parameters - parameters to pass to Worklight Adpater
			 */
			invokeSendEmailAdapter: function(procedure, parameters){				
				var def = Q.defer();
				var data = {
						adapter: "SendEmailAdapter",
						procedure: procedure,
						parameters: parameters
				};
				var options = {
					onSuccess: function(result){
						def.resolve(result.invocationResult);						
						alert('The email has been sent!');
					},
					onFailure: function(err){
						console.error("Error calling SendEmailAdapter",err);
						def.reject(err);												
					}
				};
				
				WL.Client.invokeProcedure(data,options);
				return def.promise;
			}
			

	};
	
	//Return the class
	return SmtpMailManager;
	
});