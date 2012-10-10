//TODO: add support for range operators and condition verbiage (/greater/ than or /equal/ to)
//TODO: certain checks should disable others (for instance, if can be cohersed to a number disable number check)
//TODO: add ability to return list of checks and pass or failure

window.arrg = window.arrg || {};
(function(arrg) {
	"use strict";

	var jsNumPat = "[-+]?(?:(?:\\d+)|(?:\\d+\\.\\d+)|(?:\\.\\d+))(?:e[-+]?\\d+)?",
	    jsCompPat = "(?:(?:>=?)|(?:<=?))",
	    jsCompRegex = new RegExp(jsCompPat),
	    types = {
		"array": {
			"reg": /arr/i,
			"check": function(arg) { return arg instanceof Array; }
		},
		"object": {
			"reg": /object/i,
			"check": function(arg) { return typeof(arg) === 'object'; }
		},
		"string": {
			"reg": /str/i,
			"check": function(arg) { return typeof(arg) === 'string'; }
		},
		"arguments": {
			"reg": /arg/i,
			"check": function(arg) { return (Object.prototype.toString.call(arg).indexOf('rguments') > 0) }
		},
		"number": {
			"reg": /num/i,
			"check": function(arg) { return typeof(arg) === 'number'; }
		},
		"regexp": {
			"reg": /regex/i,
			"check": function(arg) { return arg instanceof RegExp; }
		},
		"integer": {
			"reg": /int/i,
			"check": function(arg) { return (arg >> 0) === arg; }
		},
		"float": {
			"reg": /float/i,
			"check": function(arg) { return (arg >> 0) !== arg; }
		},
		"natural": {
			"reg": /nat/i,
			"check": function(arg) { return (types["integer"].check(arg) && arg > 0); }
		},
		"positive": {
			"reg": /pos/i,
			"check": function(arg) { return arg > 0; }
		},
		"whole": {
			"reg": /whole/i,
			"check": function(arg) { return (types["integer"].check(arg) && arg > -1); }
		},
		"negative": {
			"reg": /neg/i,
			"check": function(arg) { return arg < 0; }
		},
		"between": {
			"reg": /between(-?[0-9]+)And(-?[0-9]+)/i,
			"match": true,
			"check": function(arg,match) { return false; }
		},
		"num-comparison": {
			"reg": new RegExp(jsCompPat+'\\s*('+jsNumPat+')|('+jsNumPat+')\\s*'+jsCompPat), 
			"match": true,
			"check": function(arg,match) { 
				//console.log(match);
				var comp     = match[0].match(jsCompRegex)[0],
					lhs      = (match[1]) ? true : false, //-- test if arg should go on left hand side of oper
					ret      = false,
					log      = "";

					switch(comp) {
						case ">":
							ret = (lhs) ? (arg > match[1]) : (match[2] > arg); 
						break;
						case ">=":
							ret = (lhs) ? (arg >= match[1]) : (match[2] >= arg); 
						break;
						case "<":
							ret = (lhs) ? (arg < match[1]) : (match[2] < arg); 
						break;
						case "<=":
							ret = (lhs) ? (arg <= match[1]) : (match[2] <= arg); 
						break;
					}
					log =  (ret) ? "[ ok ] arrg: compare " : "[fail] arrg: compare ";
					log += (lhs) ? "("+arg+" "+comp+" "+match[1]+")" : "("+match[2]+" "+comp+" "+arg+")";
					(ret) ? console.info(log) : console.error(log);
					return ret;
			}
		},
		"num-range-verbal": {
			"reg": new RegExp('(?:between|from)\\s*('+jsNumPat+')\\s*(inclusive|exclusive)?\\s*(?:and|to)\\s*('+jsNumPat+')\\s*(inclusive|exclusive)?'),
			"match": true,
			"check": function(arg, match) {
				var pass = true;
				//console.log(match);
				pass = (types["num-comparison"].check(arg, [">"+(/incl/i.test(match[2]) ? '=':'')+match[1],match[1],null])) ? pass : false;
				pass = (types["num-comparison"].check(arg, ["<"+(/incl/i.test(match[4]) ? '=':'')+match[3],match[3],null])) ? pass : false;
				return pass;
			}
		},
		"num-compare-verbal": {
			"reg": /blahblahblah/,
			"check": function() {return true;}
		}
	};

	//-- for internal use when I know which ref - doesn't work for conditionals types
	function checkType(typeRef, arg) {
		return types[typeRef].check(arg);
	}

	function checkTypes(typeStr, arg) {
		var pass  = true,
			check = true,
			curr  = null;

		console.info("arrg: checking if arg("+arg+") obeys \""+typeStr+"\"");
		for(var i in types) {
			curr = types[i];
			//console.log(i);
			if(curr.reg && curr.reg.test(typeStr)) {
				// the comparison checks need the match information
				check = (curr.match) ? curr.check(arg, typeStr.match(curr.reg)) : curr.check(arg);
				(check) ?
					console.info("[ ok ] arrg: typeCheck("+i+")") : 
					console.error("[fail] arrg: typeCheck("+i+")");
				pass = (check) ? pass : false;
			}
			//if(!check) { break; } // bail if a check fails - needs to be optional
		}
		return pass;
	}

	//-- add to global namespace
	arrg.check = checkTypes;
	arrg.Types = types;

})(window.arrg);

if (typeof define === 'function' && define.amd) {
	define(function () {
		return window.arrg;
    });
}
