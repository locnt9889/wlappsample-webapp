define([],function(){
	
	/**
	 * Simple class that is used to show unit test and coverage test execution via Karma. See the test/unit/SampleSpec.js
	 * file.  You can run the tests via 'grunt unit'.
	 * @module Sample
	 * @memberof commonapp
	 */
	return {
		/**
		 * Simply takes in a true or false value and returns the matching 1 or 0 integer
		 * @param {boolean} option - true or false
		 * @returns {number} 1 if true, and 0 if false
		 */
		doSomething: function(option){
			if(option){
				return 1;
			}else{
				return 0;
			}//end if
		}
	};
});