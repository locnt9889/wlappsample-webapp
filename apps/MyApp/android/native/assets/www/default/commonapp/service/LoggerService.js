
/* JavaScript content from commonapp/service/LoggerService.js in folder common */
define(
		[ "Q" ],
		/** @lends */
		function(Q) {

			/**
			 * This service store data logs and share data log between all controller.
			 * 
			 * @class
			 */
			function LoggerService($log) {
				if (!(this instanceof LoggerService)) {
					throw new TypeError(
							"LoggerService constructor cannot be called as a function.");
				}// end if

				// this.worklightAdapterSrvc = worklightAdapterSrvc;
				this.$log = $log;
			}

			var listLogs = [];
			var statusLog = true;
			LoggerService.prototype = {
				constructor : LoggerService,

				/**
				 * Get list of logs
				 * 
				 * @returns {Object} the list of logs, this object contain datetime, tag, message
				 */
				getLogs : function() {
					return listLogs;
				},
				/**
				 * Set log and add to listLogs
				 * @param tag{String} the type of logs : info, warning, error
				 * @param message{String} the content of log
				 */
				log : function(tag, message) {
					if (statusLog) {
						var date = new Date();
						var data = {};
						data.dateTime = date;
						data.tag = tag;
						data.message = message;
						listLogs.push(data);
					}
				},
				/**
				 * Clear all logs
				 */
				clearLog : function() {
					listLogs = [];
				},
				/**
				 * Set status write log
				 * @param isLog{Boolean} 
				 */
				enableLog : function(isLog) {
					statusLog = isLog;
				},
				/**
				 * get status of writing log
				 * @returns {Boolean} true or false 
				 */
				getStatusLog:function(){
					return statusLog;
				}
			};

			return [ "$log", LoggerService ];

		});