
/* JavaScript content from js/lib/ibm-email-sender/js/common/ClientEmailSender.js in folder common */
/**
 * This Class acts as a wrapper object for sending an email
 * @module ibm-email-sender/common/ClientEmailSender
 */
define([],function(){
	
	// Forces the JavaScript engine into strict mode
	 "use strict";
	 
	/**
	 * ClientEmailSender Constructor
	 * This first guard ensures that the callee has invoked our Class' constructor function
	 * with the `new` keyword - failure to do this will result in the `this` keyword referring
	 * to the callee's scope (typically the window global) which will result in the following fields
	 * (_emailAddress, _subject and _body) leaking into the global namespace and not being set on this object.
	 */
	 
	function ClientEmailSender(){		
        if (!(this instanceof ClientEmailSender)) {
            throw new TypeError("ClientEmailSender constructor cannot be called as a function.");
        }    
        this._emailAddress = null;
        this._subject = null;
        this._body = null;
	};
	
	 /**
	* Adding static properties.
	*/
	ClientEmailSender.PLUGIN_NAME = "IBMEmailSender";
	ClientEmailSender.SENDMAIL_KEYWORD = "SEND_MAIL";
	
	/**
	* public static methods are defined in the same way; here's a static constructor for our ClientEmailSender class
	* which also sets the ClientEmailSender's address, subject and body properties.
	* @param email {string} - the email address/addresses to send an email to.
	* @param subject {string} - the subject of the email.
	* @param body {string} - the content of the email.
	*/
	ClientEmailSender.create = function (email, subject, body) {
		var emailSender = new ClientEmailSender();
		emailSender.setEmailAddress(email);
		emailSender.setSubject(subject);
		emailSender.setBody(body);		 
		return emailSender;
	};
	
	/**
	* Any functions not added to the ClientEmailSender reference won't be visible, or accessible outside of
	* this file(closure); however, these methods and functions don't belong to the ClientEmailSender class either
	* and are static as a result.
	* @param sender{object} - the ClientEmailSender object
	*/
	function sendEmail(sender) {
		if(checkDeviceOs()=='android') {
	        cordova.exec(sendMailSuccess(), sendMailFailure(), ClientEmailSender.PLUGIN_NAME, ClientEmailSender.SENDMAIL_KEYWORD, [sender._emailAddress, sender._subject, sender._body]);
	    } else if(checkDeviceOs()=='ios'){	        
	        //EmailComposer.showEmailComposer(sender._subject, sender._body, [sender._emailAddress], [], [], true);
	        var args = {};
	        args.subject = sender._subject ? sender._subject : "";
	        args.body = sender._body ? sender._body : "";
	        args.toRecipients = sender._emailAddress.split(/[;,]/);
	        args.ccRecipients = [];
	        args.bccRecipients = [];
	        args.bIsHTML = true;
	        args.attachments = sender.attachments ? sender.attachments : [];
	        cordova.exec(null, null, "EmailComposer", "showEmailComposer", [args]);
	    }
	};
	
	function sendMailSuccess(){
	    console.log("Send mail successful");
	};

	function sendMailFailure(){
	    console.log("Send mail failure");
	};	
	
	/**
	 * This function uses the useragent property of navigator object to detect device's operating system
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
	};
	
	
	/**
	* The prototype is a special type of Object which is used as a the blueprint for all instances
	* of a given Class; by defining functions and properties on the prototype we reduce memory
	* overhead.
	*/
	ClientEmailSender.prototype = {
		constructor: ClientEmailSender,
		
		setEmailAddress: function(address){
			this._emailAddress = address;
		},
		
		setSubject: function(subject){
			this._subject = subject;
		},
		
		setBody: function(body){
			this._body = body;
		},
		
		send: function(){
			return sendEmail(this);
		}
			
	};
	
	//Return the class
	return ClientEmailSender;	
});
