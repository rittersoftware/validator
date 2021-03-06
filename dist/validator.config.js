/*! validator - v2.0.7 - 2016-05-11
* https://github.com/filamentgroup/validator
* Copyright (c) 2016 Filament Group; Licensed MIT */
// Input a credit card number string, returns a key signifying the type of credit card it is
(function( w ) {
	"use strict";

	var types = {
		MASTERCARD: /^(2[2-7]|5[1-5])/, // 22-27 and 51-55
		VISA: /^4/,
		DISCOVER: /^6(011|5)/, // 6011 or 65
		AMEX: /^3[47]/ // 34 or 37
	};

	function CreditableCardType( val ) {
		for( var j in types ) {
			if( !!val.match( types[ j ] ) ) {
				return j;
			}
		}

		return -1;
	}

	CreditableCardType.TYPES = types;
	w.CreditableCardType = CreditableCardType;

}( typeof global !== "undefined" ? global : this ));

// Input a credit card number string, returns a key signifying the type of credit card it is
(function( w, $ ) {
	"use strict";

	var lengths = {
		MASTERCARD: 3,
		VISA: 3,
		DISCOVER: 3,
		AMEX: 4
	};

	function CreditableSecurityCode( securityCodeElement ) {
		this.$el = $( securityCodeElement );
		this.$creditCard = this.$el.closest( "form" ).find( "[data-creditable-creditcard]" );

		var self = this;
		this.$creditCard.on( "change", function() {
			self.updateSecurityCode();
		});
		this.updateSecurityCode();
	}

	CreditableSecurityCode.prototype.updateSecurityCode = function() {
		var maxlen = this.getMaxlength();
		if( maxlen ) {
			this.$el.attr( "maxlength", maxlen );
		} else {
			this.$el.removeAttr( "maxlength" );
		}
		this.$el.attr( "placeholder", this.getPlaceholder( maxlen || 4 ) );
	};

	CreditableSecurityCode.prototype.getMaxlength = function() {
		return lengths[ CreditableCardType( this.$creditCard.val() ) ];
	};

	CreditableSecurityCode.prototype.getPlaceholder = function( maxlen ) {
		var len = maxlen || this.getMaxlength() || 4;
		return ( new Array( len ) ).join( "0" ) + "0";
	};

	$(document).on( "enhance", function( e ) {
		$( e.target ).find( "[data-creditable-securitycode]" ).each(function() {
			var $t = $( this );
			var key = "creditable-securitycode";

			if( !$t.data( key ) ) {
				$t.data( key, new CreditableSecurityCode( this ) );
			}
		});
	});

	CreditableSecurityCode.LENGTHS = lengths;
	w.CreditableSecurityCode = CreditableSecurityCode;

}( typeof global !== "undefined" ? global : this, jQuery ));

/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.config, {
		"birthday": {
			"pattern" : "^(0[1-9]|1[0-2])[ -\\/]?(0[1-9]|[12][0-9])|(0[469]|11)[ -\\/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[ -\\/]?(0[1-9]|[12][0-9]|3[01])$"
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.copy, {
		"birthday": {
			"placeholder": "MM DD",
			"message" : "Birthday should be a two digit month and two digit day."
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.config, {
		"ccexpiration" : {
			"pattern" : "^[0-9]{4}[ -\\/\\.]?[0-9]{2}$"
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.copy, {
		"ccexpiration": {
			"placeholder": "YYYY MM"
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
/* global CreditableCardType:true */
/* global CreditableSecurityCode:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.config, {
		"credit": [
			{
				"id": "mastercard",
				"regex": CreditableCardType.TYPES.MASTERCARD,
				"fullRegex": "^(2[2-7]|5[1-5])\\d{14}$",
				"maxlength": "16",
				"cvvlength": CreditableSecurityCode.LENGTHS.MASTERCARD
			},
			{
				"id": "visa",
				"regex": CreditableCardType.TYPES.VISA,
				"fullRegex": "^4\\d{15}$",
				"maxlength": "16",
				"cvvlength": CreditableSecurityCode.LENGTHS.VISA
			},
			{
				"id": "discover",
				"regex": CreditableCardType.TYPES.DISCOVER,
				"fullRegex": "^6(011\\d{12}|5\\d{14})$",
				"maxlength": "16",
				"cvvlength": CreditableSecurityCode.LENGTHS.DISCOVER
			},
			{
				"id": "amex",
				"regex": CreditableCardType.TYPES.AMEX,
				"fullRegex": "^3[47]\\d{13}$",
				"maxlength": "15",
				"cvvlength": CreditableSecurityCode.LENGTHS.AMEX
			}
		]
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.copy, {
		"credit" : {
			"placeholder": "0000 0000 0000 0000",
			"message": "Not a valid credit card number.",
			"visa": {
				"message": "Visa cards should have 16 digits."
			},
			"mastercard": {
				"message": "Mastercards should have 16 digits."
			},
			"discover": {
				"message": "Discover cards should have 16 digits."
			},
			"amex": {
				"message": "American Express cards should have 15 digits."
			}
		},
		"ccexpiration": {
			"placeholder": "YYYY MM"
		},
		"cvv" : {
			"message" : "Security code requires a valid card credit card number.",
			"visa": {
				"message": "Visa cards should have a 3 digit security code."
			},
			"mastercard": {
				"message": "Mastercards should have a 3 digit security code."
			},
			"discover": {
				"message": "Discover cards should have a 3 digit security code."
			},
			"amex": {
				"message": "American Express cards should have a 4 digit security code."
			}
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.config, {
		"email" : {
			"pattern" : "^\\S+@\\S+\\.\\S+$"
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.copy, {
		"email" : {
			"message" : "Incorrect e-mail format."
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.copy, {
		"length": {
			"message": {
				"characters": {
					"singular": {
						"minlength": "Needs to be at least one character.",
						"maxlength": "Needs to be less than or equal to one character."
					},
					"plural": {
						"minlength": "Needs to be at least {0} characters.",
						"maxlength": "Needs to be less than or equal to {0} characters."
					}
				},
				"options": {
					"singular": {
						"minlength": "Select at least one option.",
						"maxlength": "Select less than or equal to one option."
					},
					"plural": {
						"minlength": "Select at least {0} options.",
						"maxlength": "Select less than or equal to {0} options."
					}
				},
				"words": {
					"singular": {
						"minlength": "Needs to be at least one word.",
						"maxlength": "Needs to be less than or equal to one word."
					},
					"plural": {
						"minlength": "Needs to be at least {0} words.",
						"maxlength": "Needs to be less than or equal to {0} words."
					}
				}
			}
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.config, {
		"numeric": {
			"pattern": "[0-9]+"
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.copy, {
		"numeric": {
			"message": "Needs to be a number."
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
  $.extend( Validator.prototype.copy, {
    "password" : {
      "message" : "Passwords must contain at least 6 characters with an uppercase letter, a lowercase letter, and a number."
    }
  });

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
  $.extend( Validator.prototype.copy, {
    "passwordconfirm" : {
      "message" : "Passwords must match."
    }
  });

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.config, {
		"phone" : {
			"pattern" : "^[\\(]?[0-9]{3}[\\)]?[ -]?[0-9]{3}[ -]?[0-9]{4}$"
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.copy, {
		"phone" : {
			"message" : "Phone numbers should have 10 digits."
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
  $.extend( Validator.prototype.copy, {
    "required" : {
      "message" : "This is required."
    }
  });

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.config, {
		"zip" : {
			"pattern" : "^\\d{5}(-?\\d{4})?$"
		}
	});

}( Validator, jQuery ));
/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
	$.extend( Validator.prototype.copy, {
		"zip" : {
			"placeholder": "00000",
			"message" : "ZIP Code should be 5 or 9 digits."
		}
	});

}( Validator, jQuery ));