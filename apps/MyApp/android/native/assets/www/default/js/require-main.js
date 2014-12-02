
/* JavaScript content from js/require-main.js in folder common */
define.amd.jQuery = true;

var appBaseUrl = window.location.href.substring(0,window.location.href.lastIndexOf("index.html"));
var tests = [];
var config = {

	    baseUrl: appBaseUrl,

	    paths: {
            "Q"                      : "js/lib/q/q",
	        "i18n"                   : "js/lib/requirejs-i18n/i18n",
	        "text"                   : "js/lib/requirejs-text/text",
	        
	        "angular"                : "js/lib/angular/angular",
	        "angular-animate"        : "js/lib/angular-animate/angular-animate",	        	       
	        "angular-sanitize"       : "js/lib/angular-sanitize/angular-sanitize",
	        "angular-route"          : "js/lib/angular-route/angular-route",
	        "angular-ui-router"      : "js/lib/angular-ui-router/release/angular-ui-router",

            "ionic"                  :  "js/lib/ionic/js/ionic",
            "ionic-angular"          :  "js/lib/ionic/js/ionic-angular",
            
            "chartjs"                :  "js/lib/chartjs/Chart",
            "ui-bootstrap"   		 :  "js/lib/angular-bootstrap/ui-bootstrap-tpls",

	        "ibm-auth"               :  "js/lib/ibm-auth/js",
	        "ibm-api-management"     :  "js/lib/ibm-api-management/js",
	        "ibm-connections-api"    :  "js/lib/ibm-connections-api/js",	        
	        "ibm-email-sender"       :  "js/lib/ibm-email-sender/js"
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
	    	console.debug("Requirejs loading.....!");
	    }
	    
	};

require.config(config);
