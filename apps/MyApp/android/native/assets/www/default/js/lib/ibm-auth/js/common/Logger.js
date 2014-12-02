
/* JavaScript content from js/lib/ibm-auth/js/common/Logger.js in folder common */
define([],/** @lends */function(){
	
	/**
	 * This class provides intelligent logging for you app.  It augments a an existing logger object (e.g. $log in Angular) with a getLoggerInstance method.
	 * The object returned from the getLoggerInstance method has log, info, debug, warn and error methods that leverage the same methods in the logger object,
	 * but also log to Worklight and Mobile Quality Assurance (MQA) if available. 
	 * @param {Object} existingLogger - the existing logger object that you are using in the JS framework (e.g. $log for Angular)
	 * @class
	 */
	function Logger(existingLogger){
		
		existingLogger.getLoggerInstance = function(context){
			return {
				_executeMethod : function(method,arguments){
					for(var x = 0; x < arguments.length; x++){
						if(typeof arguments[x] === 'object'){
							arguments[x] = JSON.stringify(arguments[x]);
						}//end if
					}//end for
					var args = [].slice.call(arguments);
					args[0] = [context + "::"] + args[0];
					
					
					try{
						if(method === "debug"){
							MQA.log.apply(null,args);
						}else{
							MQA[method].apply(null,args);
						}//end if
					}catch(e){
						try{
							WL.Logger[method].apply(null,args);
						}catch(f){
							try{
								existingLogger[method].apply(null,args);
							}catch(g){
								console.error("Failed to call method",method,"on context",context,"with params",arguments,g);
							}//end try
						}//end try
					}//end try
					
				},
				
				log : function(){
					this._executeMethod("log",arguments);
				},
				info : function(){
					this._executeMethod("info",arguments);
				},
				warn : function(){
					this._executeMethod("warn",arguments);
				},
				debug : function(){
					this._executeMethod("debug",arguments);
				},
				error : function(){
					this._executeMethod("error",arguments);
				}
			};
		};
	}
	
	return Logger;
	
});