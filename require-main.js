define.amd.jQuery = true;

var appBaseUrl;
var tests = [];
if(window.__karma__){
	console.debug("Listing karma tests to load via requirejs");
	appBaseUrl = 'base/<%= wlApp %>/common';
	// Load karma tests
	for (var file in window.__karma__.files) {
		  if (window.__karma__.files.hasOwnProperty(file)) {
			 // window.__karma__.files[file.replace(/^\//, '')] =
				// window.__karma__.files[file];//duplicate file references to
				// window.__karma__.files that map to what the monkeypatch is
				// looking for (basically, removing the leading slash so the URL
				// becomes a Require.js module path)
		    if (/Spec\.js$/.test(file)) {
		      tests.push(file);
		    }// end if
		  }// end if
	}// end for
}else{
	console.debug("Running app in non-test mode. i.e. not karma unit tests");
	appBaseUrl = window.location.href.substring(0,window.location.href.lastIndexOf("index.html"));
	
}// end if

var config = {

	    baseUrl: appBaseUrl,

	    paths: {
            "Q"                      : "js/lib/q/q",
	        "i18n"                   : "js/lib/requirejs-i18n/i18n",
	        "text"                   : "js/lib/requirejs-text/text",
	        
	        "angular"                : "js/lib/angular/angular<%= postfix %>",
	        "angular-animate"        : "js/lib/angular-animate/angular-animate<%= postfix %>",	        	       
	        "angular-sanitize"       : "js/lib/angular-sanitize/angular-sanitize<%= postfix %>",
	        "angular-route"          : "js/lib/angular-route/angular-route<%= postfix %>",
	        "angular-ui-router"      : "js/lib/angular-ui-router/release/angular-ui-router<%= postfix %>",

            "ionic"                  :  "js/lib/ionic/js/ionic<%= postfix %>",
            "ionic-angular"          :  "js/lib/ionic/js/ionic-angular<%= postfix %>",
            
            "chartjs"                :  "js/lib/chartjs/Chart<%= postfix %>",
            "ui-bootstrap"   		 :  "js/lib/angular-bootstrap/ui-bootstrap-tpls<%= postfix %>",

	        "ibm-auth"               :  "js/lib/ibm-auth/<%= IBMLibDir %>",
	        "ibm-api-management"     :  "js/lib/ibm-api-management/<%= IBMLibDir %>",
	        "ibm-connections-api"    :  "js/lib/ibm-connections-api/<%= IBMLibDir %>",	        
	        "ibm-email-sender"       :  "js/lib/ibm-email-sender/<%= IBMLibDir %>"
	    },

	    /**
		 * for libs that either do not support AMD out of the box, or require
		 * some fine tuning to dependency mgt'
		 */
	    shim: {
	    	'angular' : {
		            exports: 'angular'
		    },
	    	'Q' : {
	            exports: 'Q'
	        },
	        'angular-animate' : {
	        	deps: ["angular"],
	        	exports: 'angular-animate'
	        },
	        
	        'ui-bootstrap' : {
	        	deps: ["angular"],
	        	exports: 'ui-bootstrap'
	        },
	        
	        'angular-sanitize' : {
	        	deps: ["angular"],
	        	exports: 'angular-sanitize'
	        },
	        

	        'angular-route' : {
	        	deps: ["angular"],
	        	exports: 'angular-route'
	        },
	        
	        'angular-ui-router' : {
	        	deps: ["angular-route"],
	        	exports: 'angular-ui-router'
	        },

            'ionic' : {
                deps: [],
                exports: 'ionic'
            },
            'ionic-angular' : {
                deps: ["angular","ionic"],
                exports: 'ionic-angular'
            }
	        
	    },
	    
	    // Load all of the karma tests (if running via karma)
	    deps: tests,
	    callback: function(){
	    	if(window.__karma__){
	    		console.debug("Karma is defined on the window object, so start the tests");
	    		window.__karma__.start();
	    	}// end if
	    }
	    
	};

if(window.__karma__){
	var wlEnvs = <%= wlEnvs %>;
	for(var x = 0; x < wlEnvs.length; x++){
		config[wlEnvs[x] + "app"] = "../" + wlEnvs[x] + "/" + wlEnvs[x] + "app";
	}// end if
}// end if
require.config(config);
