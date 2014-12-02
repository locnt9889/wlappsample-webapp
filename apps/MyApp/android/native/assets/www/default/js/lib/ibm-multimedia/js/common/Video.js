
/* JavaScript content from js/lib/ibm-multimedia/js/common/Video.js in folder common */
define([],/** @lends */function(){
	
	/**
	 * This class provides access to the devices accelerometer, in order to perform higher level functions such as "shake" detection.
	 * @class
	 */
	function Video(){
		if (!(this instanceof Video)) {
            throw new TypeError("Video constructor cannot be called as a function.");
        }//end if
	}
	
	/**
	 * Callback function when play a video successful
	 * @param null
	 * @return void
	 */
	Video.playVideoSuccess = function(){
		alert("playVideoSuccess");
	};
	
	/**
	 * Callback function when play a video fail
	 * @param null
	 * @return void
	 */
	Video.playVideoFail = function(){
		alert("playVideoFail");
	};
	
	/**
	 * Plays the specified video in an Android native page
	 * @param url  The video URL
	 */
	Video.playVideo = function(url) {
		if (Video.isIphone()) {
			try {
				cordova.exec(Video.playVideoSuccess,Video.playVideoFail,"MediaLibraryPlugin", "playVideo",[]);
			} catch(error) {
				console.log(error);
			}
		} else if (Video.isAndroid()) {

			// Create an object to hold the URL.  The field name, urlParam, must match
			// the name used in the native Android Java code for extracting the URL
			var params = {urlParam : url};

			// Show the Android native page
			WL.NativePage.show("com.ibm.cio.plugins.StreamingVideoActivity", Video.backFromNativePage, params);
		}
		
	};
	
	/**
	 * Invoked as a call-back on return from the Android native page
	 * @param data
	 */
	Video.backFromNativePage = function(data) {
		WL.Logger.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> backFromNativePage");
		WL.Logger.debug("Back from StreamingVideoActivity");
	};
	
	/**
	 * Check to see whether user's device is using iOS platform
	 * @return {bool}        true means iOS platform, false means other platforms
	 */
	Video.isIphone = function() {
		if( /iPhone/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent)) {
			return true;
		} 
		return false;
	};
	
	/**
	 * Check to see whether user's device is using Android platform
	 * @return {bool}        true means Android platform, false means other platforms
	 */
	Video.isAndroid = function() {
		if( /Android/i.test(navigator.userAgent) ) {
			return true;
			 
		}	
		return false;	
	};
	
	return Video;

});