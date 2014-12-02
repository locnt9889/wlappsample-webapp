
/* JavaScript content from js/lib/ibm-auth/js/common/URL.js in folder common */
define([],/** @lends */function(){
	
	/**
	 * This class provides static method to work open URLs in your app in a secure fashion.
	 * @class
	 */
	function URL(){
		if (!(this instanceof URL)) {
            throw new TypeError("URL constructor cannot be called as a function.");
        }//end if
	}	
	
	/**
	 * Static method to load a url.  The url is first load attempt is from within Cordova's in app browser, and if that fails, an attempt is made
	 * to load it in the Maas360 secure browser.  This covers the case where you are within the IBM intranet on wifi, and when you are outside
	 * the IBM intranet (i.e. red zone access).  Because the URL is loaded in the in app browser, we also ensre that web pages are only diaplyed in
	 * trusted apps (i.e. yours and the Maas360 browser)
	 * @param {String} url - the url to load (without protocol).  https:// will be prepended automatically.  You must deliver resources over https always.
	 * for the secure browser, maas360browser:// is prepended
	 * @param {int} timeout - the number of seconds to wait for in app browser before trying MaaS360.  Default is 5 seconds.
	 */
	URL.load = function(url,timeout){
		//First try to load the URL in the in app browser.  If that fails, then try with maas360 secure browser
		var busy = new WL.BusyIndicator();
		var ref = window.open("https://" + url,"_blank",'hidden=yes');
		
		if(!timeout){
			timeout = 5000;
		}else{
			timeout = timeout * 1000;
		}//end if
		
		var handle = setTimeout(function(){
			busy.hide();
			ref.close();
			console.warn("Timeout trying to load via in app browser, try MaaS360 secure browser");
			checkSecuredBrowserAndLaunch(url);
			
		},timeout);
		
		busy.show();
		ref.addEventListener("loaderror",function(){
			clearTimeout(handle);
			console.warn("Failed to load url in in app browser try to load now via maas360 browser");
			busy.hide();
			ref.close();
			checkSecuredBrowserAndLaunch(url);
		});
		ref.addEventListener("loadstop",function(){
			clearTimeout(handle);
			//Show the in app browser
			busy.hide();
			ref.show();
		});
		ref.addEventListener("exit",function(){
			clearTimeout(handle);
			busy.hide();
		});
	};
	
	//TODO: Not sure why we have this repeated functionality from the URL.load method, with less logging and no support for timing out the 
	//request.  It is also not obvious from the function name that maas360 secure browser is used as a backup on loaderror
	URL.openInAppBrowser = function(url) {	
		//prepend https to any url that has no protocol
		if(url.indexOf("http://") < 0 || url.indexOf("https://") < 0){
			url = "https://" + url;
		}		
		var ref = window.open(url, "_blank", "location=yes,closebuttoncaption=Close");		
		var indicator = new WL.BusyIndicator();
		if(ref){
			ref.addEventListener('loadstart', function() {				
				indicator.show();
			});

			ref.addEventListener("loaderror",function() {				
				if(indicator !== null){
					indicator.hide();
				}	
				ref.close();
				checkSecuredBrowserAndLaunch(url);
			});

			ref.addEventListener("loadstop", function() {				
				if(indicator !== null){
					indicator.hide();
				}
				//ref.show();
			});

			ref.addEventListener("exit", function() {				
				if(indicator !== null){
					indicator.hide();
				}
			});
		}
	};		
		
	/**
	 * Function to check for device's OS
	 */
	function checkDeviceOs() {
		var ua = navigator.userAgent;
		if (/iPhone|iPad|iPod/i.test(ua)){
			return 'ios';
		}else if (/Android/i.test(ua)){
			return 'android';
		}else if (/Blackberry|RIM\sTablet/i.test(ua)){
			return 'blackberry';
		}else{
			return 'others';
		}	
	}	
	
	/**
	 * Call plugin to check if MaaS360 browser has been installed
	 */
	function checkSecuredBrowserAndLaunch(url){
		if (checkDeviceOs() === "android") {			
			cordova.exec(function onSuccess(data){
					if (data.status > 0) {
						cordova.exec(function success(data){},function failure(error){}, "SecuredBrowserPlugin", "openSecuredBrowser", [url]);
					} else {
						alert("MaaS360 browser has not been installed.");
					}					
				},function onFailure(error){
					alert("MaaS360 browser has not been installed.");
				},"SecuredBrowserPlugin", "checkSecuredBrowserInstalled", []);
		} else if(checkDeviceOs() === "ios") {			
			var moduleName = "maas360browser://";
			cordova.exec(function onSuccess(data){
				if (data === true) {
					window.location.href = "maas360browser://" + url;
				} else {
					alert("MaaS360 browser has not been installed.");
				}
				
			}, function onFailure(error){
				alert("MaaS360 browser has not been installed.");
			},"SAiOSKeychainPlugin", "applicationIsInstalled", [moduleName]);		
		}
	}	
	
	return URL;
});