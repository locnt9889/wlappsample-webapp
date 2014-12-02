
/* JavaScript content from js/lib/ibm-auth/js/common/ngLoader.js in folder common */
define(["Q",
        "angular"],function(Q,angular){
	
	
	return {
		/**
		 * Helper class to work with Angular and requirejs
		 * @module ibm-auth/common/ngLoader
		 */
		
		/**
		 * This function takes in an ngconfig JSON string, and configures the angular injector
		 * @param config {object} - the JSON object that defines the angular app (@see ngconfig.json)
		 * @returns Q deferred that resolves with top level app module
		 */
		config : function(config,onlyModules){
			var def = Q.defer();

			var m;
			var ng;
			var promises = [];
			for(var x = 0; x < config.modules.length;x++){
				//Create each module
				m = config.modules[x];
				if(onlyModules && onlyModules.indexOf(m.name) < 0){
					console.debug("Skip loading module",m.name);
				}else{
					ng = angular.module(m.name,m.deps);
					//Now add controllers etc.
					promises.push(this._add(ng,"controller",m.controllers));
					promises.push(this._add(ng,"directive",m.directives));
					promises.push(this._add(ng,"filter",m.filters));
					promises.push(this._add(ng,"factory",m.factories));
					promises.push(this._add(ng,"service",m.services));
					promises.push(this._add(ng,"config",m.config));
					promises.push(this._add(ng,"run",m.run));
				}//end if
			}//end for 
			Q.all(promises).done(function(){
				console.debug("All promises are resolved, so config is fully loaded");
				require(config.amdLoad,function(){
					def.resolve();
				});
			});
			return def.promise;
		},
		
		_add : function(ng,type,defns){
			var def = Q.defer();
			if(!defns){
				def.resolve();
				return def.promise;
			}
			require(defns,function(){
				for(var x = 0; x < arguments.length; x++){
					console.debug("Registering ",type,defns[x]);
					if(type === "config" || type === "run"){
						ng[type](arguments[x]);
					}else{
						ng[type](defns[x],arguments[x]);
					}//end if
					
					console.debug("Registration done");
				}//end for
				
				
				def.resolve();
			});
			return def.promise;
		}
	};
});