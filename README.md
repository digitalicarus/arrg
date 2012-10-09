arrg
====

An argument processor / type checker / code writer

The intent is to ultimately implement a declarative syntax for rules of a library or API.

This could be used dynamically to validate arguments passed to an API against a set of rules
or to generate code that efficiently does this. This could effectively reduce all of the boilerplate
argument processing code in a JS project as well as automatically generate documentation. It could
also be viewed as a shim to add some amount of typing to JS. 

An AMD module that slurped in rule text (which is really just JSON) and produced the efficient
argument processing code could also be another step. In this way you could make what is effectively 
precompilers for JS which took a declarative syntax for code generation. 

<b>
Currently a simple argument checking system check.js is the only piece somewhat fully implemented.
It can take simple prose such as "I need an integer which is > 2 and < 5" and check all of these things.
It's not a NLP, but that would be fun :)
</b>

A potential readme syntax guide for the processor follows:

<pre>
<code>
/**                                                                                                                      
 *                                                                                                                       
 * process(rules, arguments)                                                                                             
 * Array of rules or just one rule. A rule is a simple string for a type check / conditional or a complex object         
 * TODO: function as a rule (generally bypasses the declarative system for unhandled cases)                              
 * type: regex of acceptable types /function|integer/.                                                                   
 *      There are special numeric types (integer, natural/positive, whole/positiveInclZero,                              
 *      negative, negativeInclZero, between#And#, between#IAnd#I)                                                        
 * required: true or false                                                                                               
 * default: a default value, checked against type                                                                        
 * alias: an alternative name {string} or array of alternative names [{string}]                                          
 * members: if type has object or array, this lists the members                                                          
 *      the value of a member "memberFoo": {} is treated as a rule                                                       
 *      if type has array, the value of the "members" can be an array of rules or a rule to all members                  
 * typeMemberMap: maps type to an object member { function: "afterFoo" }                                                 
 *      only valid when "members" exists                                                                                 
 * valMap: maps one value to another { "fast": 500 }                                                                     
 *      also can map an accepted type to a function that returns another accepted type                                   
 *      { "string": function(val) { return val.parseInt(); } }                                                           
 *                                                                                                                       
 *  @return {array|typePassed} the array of processed args                                                               
 *                                                                                                                       
 *                                                                                                                       
 * in the future doc should be pluggable with templates                                                                  
 * doc(rules)                                                                                                            
 *                                                                                                                       
 * configure(config)                                                                                                     
 * inlineErrors:                                                                                                         
 * logLevel:                                                                                                             
 */   
</code>
</pre>

