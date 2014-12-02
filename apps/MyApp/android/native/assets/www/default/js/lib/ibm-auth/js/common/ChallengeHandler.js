
/* JavaScript content from js/lib/ibm-auth/js/common/ChallengeHandler.js in folder common */
define(["Q"],/** @lends */function(Q){
	
	/**
	 * This class sets up a challenge handler for a given realm, and is able to also handle IBM secure gateway challenges.  For example
	 * IMC/LMC.
	 * @class
	 */
	function ChallengeHandler(){
		if (!(this instanceof ChallengeHandler)) {
            throw new TypeError("ChallengeHandler constructor cannot be called as a function.");
        }//end if
		this._ensureChallengeHandler();
		//Setup event listener for disconnect
	    document.addEventListener(WL.Events.WORKLIGHT_IS_DISCONNECTED, function(){
	 		if(this._submitCredentialsDef !== null){
	 			console.warn("Cannot submit credentials when disconnected from Worklight");
	 			this._submitCredentialsDef.reject({errorMsg: "No network connection.  Please connect to the network and try again."});
	 			this._submitCredentialsDef = null;
		 	}//end if
		 }, false);
	}
	
	ChallengeHandler.prototype = {
			constructor:  ChallengeHandler,
			
			/**
			 * Used to store a pointer to the WL challenge handler for this._realm
			 * @private
			 * @type {Function}
			 */
			_challengeHandler: null,
			
			/**
			 * Callback function to display the login UI
			 * @private
			 * @type {Function}
			 */
			_onShowLogin: null,
			
			/**
			 * Holds users credentials temporarily in memory during login
			 * @private
			 * @type {Function}
			 */
			_credentials: null,
			
			/**
			 * The Worklight realm that this instance will create a challenge handler for
			 * @private
			 * @type {String}
			 * @default
			 */
			_realm: "ServicesRealm",
			
			/**
			 * Whether to connect through IMC
			 * @private
			 * @type {boolean}
			 * @default
			 */
			_useIMC : false,
			
			/**
			 * The URL to connect to on the Worklight server through the IMC proxy.  Usually set to the /console/#catalog location
			 * @type {String}
			 * @private
			 */
			_imcConnectUrl : null,
			
			/**
			 * The name of the auth adapter that contains the submitAuth method
			 * @private
			 * @type {String}
			 * @default
			 */
			_authAdapterName : "ServicesAuthAdapter",
			
			/**
			 * The name of the method used on the auth adapter to submit credentials
			 * @private
			 * @type {String}
			 * @default
			 */
			_submitAuthMethodName : "submitAuth",
			
			/**
			 * Timeout in milliseconds.  The setter translates to milliseconds.
			 * @type {Number}
			 * @private
			 * @default
			 */
			_loginTimeout: 10000,
			
			/**
			 * Flag to know if we are waiting on a login response
			 * @type {boolean}
			 * @private
			 */
			_waitingOnLoginResponse: false,
			
			/**
			 * Pointer to the deferred that submitCredentials method will either reject or resolve.  Used to reject if device is disconnected
			 * from the network.
			 * @type {Defferred}
			 * @private
			 */
			_submitCredentialsDef: null,
			
			
			/**
			 * This method is used to submit credentials to Worklight
			 * @param credentials
			 */
			submitCredentials : function(credentials){
				var def = Q.defer();
				var timeoutHandle = null;   //Make sure to reject def if timeout is reached.
				this._submitCredentialsDef = def;
				try{
					WL.Device.getNetworkInfo(function(info){
						console.debug("Checking if device is connected to the network");
						if(info.isNetworkConnected === false){
							console.warn("Cannot submit credentials when disconnected from Worklight");
							def.reject({errorMsg: "No network connection.  Please connect to the network and try again."});
						}else{
							console.debug("Device is not connected to the network");
						}//end if
					});
				}catch(e){console.warn("Failed to determine if device is connected to the network.  May not be Android or iOS device");}
				
				if(this._useIMC === true){
					this._submitCredentialsToIMC(credentials).then(function(){
						console.debug("Success submitting credentials to IMC. Now submit them to Worklight.");
						this._submitCredentialsToWorklight(credentials).then(
						function(){
							if(timeoutHandle !== null){window.clearTimeout(timeoutHandle);}
							console.debug("Success submitting credentials to worklight");
							def.resolve();
						},
						function(err){
							if(timeoutHandle !== null){window.clearTimeout(timeoutHandle);}
							console.error("Error submitting credentials to Worklight",err);
							def.reject(err);
						});
					}.bind(this),
					function(err){
						if(timeoutHandle !== null){window.clearTimeout(timeoutHandle);}
						console.error("Error submitting credentials to IMC",err);
						def.reject(err);
					}.bind(this));
				}else{
					this._submitCredentialsToWorklight(credentials).then(
							function(){
								if(timeoutHandle !== null){window.clearTimeout(timeoutHandle);}
								console.debug("Success submitting credentials to worklight");
								def.resolve();
							},
							function(err){
								if(timeoutHandle !== null){window.clearTimeout(timeoutHandle);}
								console.error("Error submitting credentials to Worklight",err);
								def.reject(err);
							});
							
				}//end if
				
				timeoutHandle = window.setTimeout(function(){
					this._challengeHandler.submitFailure();
					def.reject({errorMsg: "Login timeout reached.  Please check your network settings."});
					}.bind(this),this._loginTimeout);
				return def.promise;
			},
			
			login : function(options){
				WL.Client.login(this._realm, options);
			},
			
			logout : function(options){
				WL.Client.logout(this._realm, options);
			},
			
			/**
			 * Sets the function to call when the login view should be displayed
			 * @param {Function} func
			 */
			onShowLogin : function(func){
				this._onShowLogin = func;
			},
			
			/**
			 * Sets the name of the auth adapter, which by default is the one that comes with the generator-catalyst scaffold - "ServicesAuthAdapter"
			 * @param {String} name - the name of the auth adapter
			 */
			setAuthAdapterName : function(name){
				this._authAdapterName = name;
			},
			
			/**
			 * This method sets the name of the auth method to call to submit username and basic auth credentials to.  By default it is set to - "submitAuth"
			 * @param {String} name - the name of the submit auth method
			 */
			setSubmitAuthMethodName : function(name){
				this._submitAuthMethodName = name;
			},
			
			/**
			 * Sets the realm that this class will create an authentication challenge handler for.  Also the one it will perform
			 * logout against
			 * @param {String} realm - the realm name as defined in authenticationConfig.xml
			 */
			setRealm : function(realm){
				this._realm = realm;
				this._challengeHandler = null;
				this._ensureChallengeHandler();
			},
			
			/**
			 * Tell this class instance to try and connect through IMC or not.  If set to true, try to connect to the imcConnectURL, if false, try to connect directly to worklight
			 * @param {boolean} value - true to use IMC and false otherwise
			 */
			setUseIMC : function(value){
				this._useIMC = value;
			},
			
			/**
			 * Set the IMC URL
			 * @param {String} url - Basic authentication is submitted to IMC, but you need to proxy through to a Worklight endpoint 
			 * to pass this authentication along.  Usually this is set to https://imcHostname:imcPort/worklightContext/console/#catalog, but you can set it to another url.
			*/
			setIMCConnectUrl : function(url){
				this._imcConnectUrl = url;
			},
			
			_submitCredentialsToIMC : function(credentials){
				var def = Q.defer();
				var basic = window.btoa(credentials.username + ":" + credentials.password);
				basic = "Basic " + basic;
				
				var url = this._imcConnectUrl;
                console.debug("Calling URL through IMC",url);
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                    	if(xhr.status == 200){
                    		console.debug("Success connecting to worklight server url through IMC",url);
                            def.resolve();
                    	}else{
                    		console.error("Failed to connect to worklight server url through IMC",url);
                    		def.reject({errorMsg: "Failed to connect to worklight server through IMC"});
                    	}//end if
                    }//end if
                }.bind(this);

                xhr.open("GET", url, true);
                xhr.setRequestHeader("Authorization",basic);
                //workaround for android devices in order to succesfully invoke the adapter
                if(WL.Client.getEnvironment() === WL.Environment.ANDROID){
                	WL.Client.addGlobalHeader("Authorization",basic);
                }//end if
                
                xhr.timeout = this._loginTimeout;
                xhr.ontimeout = function () { 
                	console.error("Request to Worklight server through IMC has timed out");
    				def.reject({errorMsg: "Request to Worklight server through IMC has timed out"});
                }.bind(this);

                //Send the GET request through IMC
                window.setTimeout(function(){xhr.abort();},this._loginTimeout);
                xhr.send();
                
                return def.promise;
			},
			
			_submitCredentialsToWorklight : function(credentials){
				var def = Q.defer();
				//TODO Ensure that we logout first and then login.  submit credentials after login 
				WL.Client.connect({
					onSuccess: function(){
						WL.Client.logout(this._realm,{
							onSuccess: function(){
								console.debug("Success logging out of realm",this._realm);
								this._credentials = credentials;
								WL.Client.login(this._realm,{
									onSuccess: function(){
										console.debug("Success logging into Worklight");
										def.resolve();
									},
									onFailure: function(err){
										console.error("Error logging into Worklight",err);
										def.reject(err);
									}
								});
							}.bind(this),
							onFailure: function(err){
								console.error("Error logging out of realm",this._realm);
								def.reject(err);
							}.bind(this)
						});
					}.bind(this),
					onFailure: function(err){
						console.error("Failed to connect to Worklight",err);
						def.reject(err);
					}.bind(this),
					timeout: this._loginTimeout
				});
				
                return def.promise;
			},
			
			/**
			 * This method ensures that there is a challenge handler created for this._realm
			 * @private
			 */
			_ensureChallengeHandler : function(){
				if(this._challengeHandler === null){
					console.debug("The challenge handler is not set, so create one for realm",this._realm);
					this._challengeHandler = WL.Client.createChallengeHandler(this._realm);
					this._challengeHandler.isCustomResponse = function(response){return this._isCustomResponse(response);}.bind(this);
					this._challengeHandler.handleChallenge = function(response){return this._handleChallenge(response);}.bind(this);
				}//end if
			},
			
			/**
			 * Checks responses for authorization required signal
			 * @param {object} response - the response to check for auth required signal
			 * @return true if auth is required and false otherwise
			 * @private
			 */
			_isCustomResponse : function(response){
				console.debug("Checking for authRequired attribute in responseJSON");
				if(!response || !response.responseJSON || !response.responseText){
					console.debug("No response JSON or text");
					return false;
				}//end if
				if(typeof(response.responseJSON.authRequired) !== 'undefined'){//TODO: add check for 401 or even j_security_check
					console.debug("authRequired attribute is present in responseJSON",response.responseJSON.authRequired);
					return true;
				}else{
					console.debug("authRequired attribute is NOT present in responseJSON");
					return false;
				}//end if
			},
			
			/**
			 * This method is called to handle an authentication challenge that was identified by _isCustomResponse returning true
			 * @param {object} response - the response that triggered a challenge
			 * @private
			 */
			_handleChallenge : function(response){
				var authRequired = response.responseJSON.authRequired;
				console.debug("authrequired === true?",authRequired === true);
				if(authRequired === true){
					console.debug("authRequired is true, calling onShowLogin");
					if(this._waitingOnLoginResponse){
						this._waitingOnLoginResponse = false;
						this._credentials = null;
						this._challengeHandler.submitFailure();
					}//end if
					
					if(this._credentials !== null){
						console.debug("Credentials are set, so submit those and do not navigate to login view");
						//this.submitCredentials(this._credentials);
						var basic = window.btoa(this._credentials.username + ":" + this._credentials.password);
						basic = "Basic " + basic;
						console.debug("Submitting credentials to Worklight");
						
						//workaround for android devices in order to succesfully invoke the adapter
		                if(WL.Client.getEnvironment() === WL.Environment.ANDROID){
		                	WL.Client.addGlobalHeader("Authorization", "Basic " + basic);
		                }//end if
		                this._waitingOnLoginResponse = true;
		                this._challengeHandler.submitAdapterAuthentication({
		                        adapter: this._authAdapterName,
		                        procedure: this._submitAuthMethodName,
		                        parameters: [this._credentials.username,this._credentials.password,basic]},{});
					}else{
						if(this._onShowLogin !== null){
							this._onShowLogin(response.responseJSON);//i.e. The login view can show an errorMsg in the responseJSON
						}else{
							console.error("onShowLogin method is undefined.  Please use onShowLogin(func) to set it");
						}//end if
					}//end if
				}else{
					console.debug("authRequired is false. Submitting success for challenge handler");
					this._waitingOnLoginResponse = false;
					this._credentials = null;//clear credentials
					this._challengeHandler.submitSuccess();
				}//end if
			},
			
			/**
			 * Sets the timeout in seconds to wait for an IMC login attempt to complete
			 * @param {integer} timeout - number of seconds to wait for login to return
			 * @deprecated use setLoginTimeout instead
			 */
			setIMCLoginTimeout : function(timeout){
				this.setLoginTimeout(timeout);
			},
			
			setLoginTimeout : function(timeout){
				this._loginTimeout = timeout * 1000;
			}
			
			
	};
	
	return ChallengeHandler;
	
});