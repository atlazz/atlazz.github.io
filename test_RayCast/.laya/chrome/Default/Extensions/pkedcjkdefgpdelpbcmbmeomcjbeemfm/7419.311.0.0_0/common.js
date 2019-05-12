'use strict';var g,aa=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}},ba="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},ca="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,da=function(){da=function(){};ca.Symbol||(ca.Symbol=ea)},fa=function(a,b){this.b=a;ba(this,"description",{configurable:!0,writable:!0,value:b})};
fa.prototype.toString=function(){return this.b};
var ea=function(){function a(c){if(this instanceof a)throw new TypeError("Symbol is not a constructor");return new fa("jscomp_symbol_"+(c||"")+"_"+b++,c)}var b=0;return a}(),ia=function(){da();var a=ca.Symbol.iterator;a||(a=ca.Symbol.iterator=ca.Symbol("Symbol.iterator"));"function"!=typeof Array.prototype[a]&&ba(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ha(aa(this))}});ia=function(){}},ha=function(a){ia();a={next:a};a[ca.Symbol.iterator]=function(){return this};return a},
k=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:aa(a)}},m=function(a){if(!(a instanceof Array)){a=k(a);for(var b,c=[];!(b=a.next()).done;)c.push(b.value);a=c}return a},ja="function"==typeof Object.create?Object.create:function(a){var b=function(){};b.prototype=a;return new b},ka;
if("function"==typeof Object.setPrototypeOf)ka=Object.setPrototypeOf;else{var la;a:{var ma={oo:!0},na={};try{na.__proto__=ma;la=na.oo;break a}catch(a){}la=!1}ka=la?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}
var oa=ka,n=function(a,b){a.prototype=ja(b.prototype);a.prototype.constructor=a;if(oa)oa(a,b);else for(var c in b)if("prototype"!=c)if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(b,c);d&&Object.defineProperty(a,c,d)}else a[c]=b[c];a.Ca=b.prototype},pa=function(a,b){if(b){var c=ca;a=a.split(".");for(var d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&ba(c,a,{configurable:!0,writable:!0,value:b})}};
pa("Promise",function(a){function b(){this.b=null}function c(a){return a instanceof e?a:new e(function(c){c(a)})}if(a)return a;b.prototype.f=function(a){if(null==this.b){this.b=[];var c=this;this.g(function(){c.j()})}this.b.push(a)};var d=ca.setTimeout;b.prototype.g=function(a){d(a,0)};b.prototype.j=function(){for(;this.b&&this.b.length;){var a=this.b;this.b=[];for(var c=0;c<a.length;++c){var b=a[c];a[c]=null;try{b()}catch(y){this.h(y)}}}this.b=null};b.prototype.h=function(a){this.g(function(){throw a;
})};var e=function(a){this.f=0;this.g=void 0;this.b=[];var c=this.j();try{a(c.resolve,c.reject)}catch(r){c.reject(r)}};e.prototype.j=function(){function a(a){return function(d){b||(b=!0,a.call(c,d))}}var c=this,b=!1;return{resolve:a(this.D),reject:a(this.h)}};e.prototype.D=function(a){if(a===this)this.h(new TypeError("A Promise cannot resolve to itself"));else if(a instanceof e)this.C(a);else{a:switch(typeof a){case "object":var c=null!=a;break a;case "function":c=!0;break a;default:c=!1}c?this.u(a):
this.w(a)}};e.prototype.u=function(a){var c=void 0;try{c=a.then}catch(r){this.h(r);return}"function"==typeof c?this.F(c,a):this.w(a)};e.prototype.h=function(a){this.m(2,a)};e.prototype.w=function(a){this.m(1,a)};e.prototype.m=function(a,c){if(0!=this.f)throw Error("Cannot settle("+a+", "+c+"): Promise already settled in state"+this.f);this.f=a;this.g=c;this.o()};e.prototype.o=function(){if(null!=this.b){for(var a=0;a<this.b.length;++a)f.f(this.b[a]);this.b=null}};var f=new b;e.prototype.C=function(a){var c=
this.j();a.lh(c.resolve,c.reject)};e.prototype.F=function(a,c){var b=this.j();try{a.call(c,b.resolve,b.reject)}catch(y){b.reject(y)}};e.prototype.then=function(a,c){function b(a,c){return"function"==typeof a?function(c){try{d(a(c))}catch(sa){f(sa)}}:c}var d,f,h=new e(function(a,c){d=a;f=c});this.lh(b(a,d),b(c,f));return h};e.prototype.catch=function(a){return this.then(void 0,a)};e.prototype.lh=function(a,c){function b(){switch(d.f){case 1:a(d.g);break;case 2:c(d.g);break;default:throw Error("Unexpected state: "+
d.f);}}var d=this;null==this.b?f.f(b):this.b.push(b)};e.resolve=c;e.reject=function(a){return new e(function(c,b){b(a)})};e.race=function(a){return new e(function(b,d){for(var e=k(a),f=e.next();!f.done;f=e.next())c(f.value).lh(b,d)})};e.all=function(a){var b=k(a),d=b.next();return d.done?c([]):new e(function(a,e){function f(c){return function(b){h[c]=b;l--;0==l&&a(h)}}var h=[],l=0;do h.push(void 0),l++,c(d.value).lh(f(h.length-1),e),d=b.next();while(!d.done)})};return e});
pa("Promise.prototype.finally",function(a){return a?a:function(a){return this.then(function(c){return Promise.resolve(a()).then(function(){return c})},function(c){return Promise.resolve(a()).then(function(){throw c;})})}});var qa=function(){this.m=!1;this.h=null;this.f=void 0;this.b=1;this.j=this.w=0;this.u=this.g=null},ra=function(a){if(a.m)throw new TypeError("Generator is already running");a.m=!0};qa.prototype.o=function(a){this.f=a};var ta=function(a,b){a.g={xc:b,fl:!0};a.b=a.w||a.j};
qa.prototype.return=function(a){this.g={return:a};this.b=this.j};var ua=function(a,b,c){a.b=c;return{value:b}};qa.prototype.dc=function(a){this.b=a};
var va=function(a,b,c){a.w=b;void 0!=c&&(a.j=c)},wa=function(a,b){a.b=b;a.w=0},xa=function(a){a.w=0;var b=a.g.xc;a.g=null;return b},ya=function(a){this.b=new qa;this.f=a},Ba=function(a,b){ra(a.b);var c=a.b.h;if(c)return za(a,"return"in c?c["return"]:function(a){return{value:a,done:!0}},b,a.b.return);a.b.return(b);return Aa(a)},za=function(a,b,c,d){try{var e=b.call(a.b.h,c);if(!(e instanceof Object))throw new TypeError("Iterator result "+e+" is not an object");if(!e.done)return a.b.m=!1,e;var f=e.value}catch(h){return a.b.h=
null,ta(a.b,h),Aa(a)}a.b.h=null;d.call(a.b,f);return Aa(a)},Aa=function(a){for(;a.b.b;)try{var b=a.f(a.b);if(b)return a.b.m=!1,{value:b.value,done:!1}}catch(c){a.b.f=void 0,ta(a.b,c)}a.b.m=!1;if(a.b.g){b=a.b.g;a.b.g=null;if(b.fl)throw b.xc;return{value:b.return,done:!0}}return{value:void 0,done:!0}},Ca=function(a){this.next=function(b){ra(a.b);a.b.h?b=za(a,a.b.h.next,b,a.b.o):(a.b.o(b),b=Aa(a));return b};this.throw=function(b){ra(a.b);a.b.h?b=za(a,a.b.h["throw"],b,a.b.o):(ta(a.b,b),b=Aa(a));return b};
this.return=function(b){return Ba(a,b)};ia();this[Symbol.iterator]=function(){return this}},Da=function(a){function b(c){return a.next(c)}function c(c){return a.throw(c)}return new Promise(function(d,e){function f(a){a.done?d(a.value):Promise.resolve(a.value).then(b,c).then(f,e)}f(a.next())})},Ea=function(a){return Da(new Ca(new ya(a)))},Fa=Fa||{},Ga=this,Ha=function(a){return void 0!==a},Ia=function(a){return"string"==typeof a},Ja=function(a){return"boolean"==typeof a},p=function(a){return"number"==
typeof a},Ma=function(a){if(a&&a!=Ga)return Ka(a.document);null===La&&(La=Ka(Ga.document));return La},Na=/^[\w+/_-]+[=]{0,2}$/,La=null,Ka=function(a){return(a=a.querySelector&&a.querySelector("script[nonce]"))&&(a=a.nonce||a.getAttribute("nonce"))&&Na.test(a)?a:""},Oa=function(a,b){a=a.split(".");b=b||Ga;for(var c=0;c<a.length;c++)if(b=b[a[c]],null==b)return null;return b},Pa=function(){},Qa=function(a){a.Di=void 0;a.Ja=function(){return a.Di?a.Di:a.Di=new a}},Ra=function(a){var b=typeof a;if("object"==
b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b},Sa=function(a){return null===a},Ta=function(a){return"array"==Ra(a)},Ua=function(a){var b=Ra(a);return"array"==b||"object"==b&&"number"==typeof a.length},Va=function(a){return"function"==Ra(a)},Wa=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},Ya=function(a){null!==a&&"removeAttribute"in a&&a.removeAttribute(Xa);try{delete a[Xa]}catch(b){}},Xa="closure_uid_"+(1E9*Math.random()>>>0),Za=0,$a=function(a,b,c){return a.call.apply(a.bind,
arguments)},ab=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},q=function(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?q=$a:q=ab;return q.apply(null,arguments)},bb=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=
c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},t=Date.now||function(){return+new Date},u=function(a,b){a=a.split(".");var c=Ga;a[0]in c||"undefined"==typeof c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&Ha(b)?c[d]=b:c[d]&&c[d]!==Object.prototype[d]?c=c[d]:c=c[d]={}},v=function(a,b){function c(){}c.prototype=b.prototype;a.Ca=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Py=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-
2]=arguments[e];return b.prototype[c].apply(a,d)}};var chrome=chrome||window.chrome||{};chrome.cast=chrome.cast||{};chrome.cast.media=chrome.cast.media||{};var mojo={};var cb=function(){return Promise.reject(Error("Not implemented"))};var db=function(a){this.b=a},fb=function(a){var b=eb.get(a);b||(b=new db(a),eb.set(a,b));return b},ib=function(a){a.level>=gb&&hb.forEach(function(b){return b(a)})};db.prototype.log=function(a,b,c){if(!(a<gb)){"function"==typeof b&&(b=b());b=b.replace(jb,"[Redacted URL]");b=b.replace(kb,"[Redacted domain/email]");b=b.replace(lb,function(a,c,b){return c+":<"+b.substr(-4)+">"});var d={N:this.b,level:a,time:Date.now(),message:b,xc:c};hb.forEach(function(a){return a(d)})}};
db.prototype.error=function(a,b){this.log(3,a,b)};db.prototype.H=function(a,b){this.log(2,a,b)};db.prototype.info=function(a,b){this.log(1,a,b)};var mb=function(a,b,c){a.log(0,b,c)},ob=function(a){a=nb.indexOf(a);return-1==a?0:a},pb=function(a){return 600>=a?0:850>=a?1:950>=a?2:3},hb=[],eb=new Map,nb=["FINE","INFO","WARNING","SEVERE"],kb=/(([\w.+-]+@)|((www|m|mail|ftp)[.]))[\w.-]+[.][\w-]{2,4}/gi,jb=/(data:|https?:\/\/)\S+/gi,lb=/(dial|cast):<([a-zA-Z0-9]+)>/gi,gb=1;var qb=function(a){this.b=a;this.f=Date.now()},rb=function(a,b){null!=b&&(a+="_"+b);return a};qb.prototype.end=function(a){sb(rb(this.b,a),Date.now()-this.f)};var sb=function(a,b){0>b&&(tb.H("Timing analytics event with negative time"),b=0);1E4<b&&(b=1E4);try{chrome.metricsPrivate.recordTime(a,b)}catch(c){tb.H("Failed to record time "+b+" in "+a)}},tb=fb("mr.Timing"),ub=function(a){qb.call(this,a)};n(ub,qb);
ub.prototype.end=function(a){a=rb(this.b,a);var b=Date.now()-this.f;if(0>b)vb.H("Timing analytics event with negative time");else{1E4>b&&(b=1E4);18E4<b&&(b=18E4);try{chrome.metricsPrivate.recordMediumTime(a,b)}catch(c){vb.H("Failed to record time "+b+" in "+a)}}};var vb=fb("mr.MediumTiming"),wb=function(a){qb.call(this,a)};n(wb,qb);
wb.prototype.end=function(a){a=rb(this.b,a);var b=Date.now()-this.f;if(0>b)xb.H("Timing analytics event with negative time");else{18E4>b&&(b=18E4);36E5<b&&(b=36E5);try{chrome.metricsPrivate.recordLongTime(a,b)}catch(c){xb.H("Failed to record time "+b+" in "+a)}}};
var xb=fb("mr.LongTiming"),yb=fb("mr.Analytics"),zb=function(a){try{chrome.metricsPrivate.recordUserAction(a)}catch(b){yb.H("Failed to record event "+a)}},Ab=function(a,b,c){var d,e=0,f;for(f in c)e++,c[f]==b&&(d=f);if(d){c={metricName:a,type:"histogram-linear",min:1,max:e,buckets:e+1};try{chrome.metricsPrivate.recordValue(c,b)}catch(h){yb.H("Failed to record enum value "+d+" ("+b+") in "+a,h)}}else yb.error("Unknown analytics value, "+b+" for histogram, "+a,Error())};var Bb=function(){var a=this;this.b=new Promise(function(b,c){a.g=b;a.f=c})};Bb.prototype.resolve=function(a){this.g(a)};Bb.prototype.reject=function(a){this.f(a)};var Cb=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,Cb);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};v(Cb,Error);Cb.prototype.name="CustomError";var Db;var Eb=function(a,b){a=a.split("%s");for(var c="",d=a.length-1,e=0;e<d;e++)c+=a[e]+(e<b.length?b[e]:"%s");Cb.call(this,c+a[d])};v(Eb,Cb);Eb.prototype.name="AssertionError";var Fb=function(a,b){throw new Eb("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var Gb=function(a){return a[a.length-1]},Hb=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if(Ia(a))return Ia(b)&&1==b.length?a.indexOf(b,0):-1;for(var c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Ib=Array.prototype.lastIndexOf?function(a,b){return Array.prototype.lastIndexOf.call(a,b,a.length-1)}:function(a,b){var c=a.length-1;0>c&&(c=Math.max(0,a.length+c));if(Ia(a))return Ia(b)&&1==b.length?a.lastIndexOf(b,c):-1;for(;0<=c;c--)if(c in
a&&a[c]===b)return c;return-1},w=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Ia(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Jb=function(a,b){for(var c=Ia(a)?a.split(""):a,d=a.length-1;0<=d;--d)d in c&&b.call(void 0,c[d],d,a)},Kb=Array.prototype.filter?function(a,b,c){return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,h=Ia(a)?a.split(""):a,l=0;l<d;l++)if(l in h){var r=h[l];b.call(c,
r,l,a)&&(e[f++]=r)}return e},Lb=Array.prototype.map?function(a,b,c){return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=Ia(a)?a.split(""):a,h=0;h<d;h++)h in f&&(e[h]=b.call(c,f[h],h,a));return e},Mb=Array.prototype.reduce?function(a,b,c){return Array.prototype.reduce.call(a,b,c)}:function(a,b,c){var d=c;w(a,function(c,f){d=b.call(void 0,d,c,f,a)});return d},Nb=Array.prototype.some?function(a,b){return Array.prototype.some.call(a,b,void 0)}:function(a,b){for(var c=
a.length,d=Ia(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a))return!0;return!1},Ob=Array.prototype.every?function(a,b,c){return Array.prototype.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Ia(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0},Qb=function(a,b,c){b=Pb(a,b,c);return 0>b?null:Ia(a)?a.charAt(b):a[b]},Pb=function(a,b,c){for(var d=a.length,e=Ia(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1},Rb=function(a,
b){a:{for(var c=Ia(a)?a.split(""):a,d=a.length-1;0<=d;d--)if(d in c&&b.call(void 0,c[d],d,a)){b=d;break a}b=-1}return 0>b?null:Ia(a)?a.charAt(b):a[b]},Sb=function(a,b){return 0<=Hb(a,b)},Tb=function(a){return 0==a.length},Ub=function(a){if(!Ta(a))for(var b=a.length-1;0<=b;b--)delete a[b];a.length=0},Vb=function(a,b){Sb(a,b)||a.push(b)},Xb=function(a,b,c){var d;2==arguments.length||0>(d=Hb(a,c))?a.push(b):Wb(a,d,0,b)},Zb=function(a,b){b=Hb(a,b);var c;(c=0<=b)&&Yb(a,b);return c},Yb=function(a,b){return 1==
Array.prototype.splice.call(a,b,1).length},$b=function(a,b,c){b=Pb(a,b,c);return 0<=b?(Yb(a,b),!0):!1},ac=function(a,b){var c=0;Jb(a,function(d,e){b.call(void 0,d,e,a)&&Yb(a,e)&&c++})},bc=function(a){return Array.prototype.concat.apply([],arguments)},cc=function(a){return Array.prototype.concat.apply([],arguments)},x=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]},dc=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(Ua(d)){var e=
a.length||0,f=d.length||0;a.length=e+f;for(var h=0;h<f;h++)a[e+h]=d[h]}else a.push(d)}},Wb=function(a,b,c,d){Array.prototype.splice.apply(a,ec(arguments,1))},ec=function(a,b,c){return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)},fc=function(a,b){b=b||a;for(var c={},d=0,e=0;e<a.length;){var f=a[e++];var h=f;h=Wa(h)?"o"+(h[Xa]||(h[Xa]=++Za)):(typeof h).charAt(0)+h;Object.prototype.hasOwnProperty.call(c,h)||(c[h]=!0,b[d++]=f)}b.length=d},hc=function(a,b){a.sort(b||
gc)},ic=function(a,b){var c=gc;hc(a,function(a,e){return c(b(a),b(e))})},jc=function(a){ic(a,function(a){return a.t})},lc=function(a,b,c){if(!Ua(a)||!Ua(b)||a.length!=b.length)return!1;var d=a.length;c=c||kc;for(var e=0;e<d;e++)if(!c(a[e],b[e]))return!1;return!0},gc=function(a,b){return a>b?1:a<b?-1:0},kc=function(a,b){return a===b},mc=function(a,b){var c={};w(a,function(d,e){c[b.call(void 0,d,e,a)]=d});return c},nc=function(a,b){return bc.apply([],Lb(a,b,void 0))};var oc=function(a,b){return 0==a.lastIndexOf(b,0)},pc=function(a,b){return a.toLowerCase()==b.toLowerCase()},qc=function(a){return/^[\s\xa0]*$/.test(a)},rc=String.prototype.trim?function(a){return a.trim()}:function(a){return/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]},sc=function(a,b){a=String(a).toLowerCase();b=String(b).toLowerCase();return a<b?-1:a==b?0:1},tc=/&/g,uc=/</g,vc=/>/g,wc=/"/g,yc=/'/g,zc=/\x00/g,Ac=/[\x00&<>"']/,Cc=function(a,b){var c=0;a=rc(String(a)).split(".");b=rc(String(b)).split(".");
for(var d=Math.max(a.length,b.length),e=0;0==c&&e<d;e++){var f=a[e]||"",h=b[e]||"";do{f=/(\d*)(\D*)(.*)/.exec(f)||["","","",""];h=/(\d*)(\D*)(.*)/.exec(h)||["","","",""];if(0==f[0].length&&0==h[0].length)break;c=Bc(0==f[1].length?0:parseInt(f[1],10),0==h[1].length?0:parseInt(h[1],10))||Bc(0==f[2].length,0==h[2].length)||Bc(f[2],h[2]);f=f[3];h=h[3]}while(0==c)}return c},Bc=function(a,b){return a<b?-1:a>b?1:0};var Dc=String.prototype.repeat?function(a,b){return a.repeat(b)}:function(a,b){return Array(b+1).join(a)},Ec=function(a,b){a=Ha(void 0)?a.toFixed(void 0):String(a);var c=a.indexOf(".");-1==c&&(c=a.length);return Dc("0",Math.max(0,b-c))+a},Fc=function(a){return null==a?"":String(a)},Gc=function(a){return Array.prototype.join.call(arguments,"")},Hc=function(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^t()).toString(36)},Ic=function(a,b,c){a=
a.split(b);for(var d=[];0<c&&a.length;)d.push(a.shift()),c--;a.length&&d.push(a.join(b));return d};var Jc;a:{var Kc=Ga.navigator;if(Kc){var Lc=Kc.userAgent;if(Lc){Jc=Lc;break a}}Jc=""}var Mc=function(a){return-1!=Jc.indexOf(a)};var Nc=function(a,b,c){for(var d in a)b.call(c,a[d],d,a)},Oc=function(a,b){var c={},d;for(d in a)c[d]=b.call(void 0,a[d],d,a);return c},Pc=function(a,b){for(var c in a)if(b.call(void 0,a[c],c,a))return!0;return!1},Qc=function(a){var b=0,c;for(c in a)b++;return b},Rc=function(a){for(var b in a)return b},Sc=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b},Tc=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b},Uc=function(a,b){return null!==a&&b in a},Vc=function(a,b){for(var c in a)if(a[c]==
b)return!0;return!1},Wc=function(a){for(var b in a)return!1;return!0},Yc=function(a){for(var b in a)delete a[b]},Zc=function(a){var b={},c;for(c in a)b[c]=a[c];return b},$c=function(a){var b=Ra(a);if("object"==b||"array"==b){if(Va(a.clone))return a.clone();b="array"==b?[]:{};for(var c in a)b[c]=$c(a[c]);return b}return a},ad=function(a){var b={},c;for(c in a)b[a[c]]=c;return b},bd="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),cd=function(a,
b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<bd.length;f++)c=bd[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}},dd=function(a){var b=arguments.length;if(1==b&&Ta(arguments[0]))return dd.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};var ed=function(){return Mc("Firefox")||Mc("FxiOS")},fd=function(){return(Mc("Chrome")||Mc("CriOS"))&&!Mc("Edge")};var gd=function(){return Mc("iPhone")&&!Mc("iPod")&&!Mc("iPad")};var hd=function(a){hd[" "](a);return a};hd[" "]=Pa;var id=function(a,b){try{return hd(a[b]),!0}catch(c){}return!1},kd=function(a,b){var c=jd;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)};var ld=function(){return Ga.navigator||null},nd=Mc("Opera"),od=Mc("Trident")||Mc("MSIE"),pd=Mc("Edge"),qd=Mc("Gecko")&&!(-1!=Jc.toLowerCase().indexOf("webkit")&&!Mc("Edge"))&&!(Mc("Trident")||Mc("MSIE"))&&!Mc("Edge"),rd=-1!=Jc.toLowerCase().indexOf("webkit")&&!Mc("Edge"),sd=rd&&Mc("Mobile"),td,ud=ld();td=ud&&ud.platform||"";
var vd=Mc("Macintosh"),wd=Mc("Windows"),xd=Mc("Linux")||Mc("CrOS"),yd=Mc("Android"),zd=gd(),Ad=Mc("iPad"),Bd=Mc("iPod"),Cd=function(){var a=Ga.document;return a?a.documentMode:void 0},Dd;
a:{var Ed="",Fd=function(){var a=Jc;if(qd)return/rv:([^\);]+)(\)|;)/.exec(a);if(pd)return/Edge\/([\d\.]+)/.exec(a);if(od)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(rd)return/WebKit\/(\S+)/.exec(a);if(nd)return/(?:Version)[ \/]?(\S+)/.exec(a)}();Fd&&(Ed=Fd?Fd[1]:"");if(od){var Gd=Cd();if(null!=Gd&&Gd>parseFloat(Ed)){Dd=String(Gd);break a}}Dd=Ed}var Hd=Dd,jd={},Id=function(a){return kd(a,function(){return 0<=Cc(Hd,a)})},Jd;var Kd=Ga.document;
Jd=Kd&&od?Cd()||("CSS1Compat"==Kd.compatMode?parseInt(Hd,10):5):void 0;var Ld=ed(),Md=gd()||Mc("iPod"),Nd=Mc("iPad"),Od=Mc("Android")&&!(fd()||ed()||Mc("Opera")||Mc("Silk")),Pd=fd(),Qd=Mc("Safari")&&!(fd()||Mc("Coast")||Mc("Opera")||Mc("Edge")||ed()||Mc("Silk")||Mc("Android"))&&!(gd()||Mc("iPad")||Mc("iPod"));var Rd=function(a){return function(){return a}},Sd=function(){return!0},Td=function(){return null},Ud=function(a){return a},Vd=function(a){return function(){throw Error(a);}},Wd=function(a){var b=b||0;return function(){return a.apply(this,Array.prototype.slice.call(arguments,0,b))}};var $d=function(a,b){this.b=a===Xd&&b||"";this.f=Zd};$d.prototype.rd=!0;$d.prototype.nd=function(){return this.b};$d.prototype.toString=function(){return"Const{"+this.b+"}"};var ae=function(a){if(a instanceof $d&&a.constructor===$d&&a.f===Zd)return a.b;Fb("expected object of type Const, got '"+a+"'");return"type_error:Const"},Zd={},Xd={};var ce=function(){this.b=be};ce.prototype.rd=!0;var be={};ce.prototype.nd=function(){return""};ce.prototype.toString=function(){return"SafeScript{}"};var de=function(a){if(a instanceof ce&&a.constructor===ce&&a.b===be)return"";Fb("expected object of type SafeScript, got '"+a+"' of type "+Ra(a));return"type_error:SafeScript"};var ee=/[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]/,fe=/^[^A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]*[\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc]/,ge=/^http:\/\/.*/,he=/\s+/,ie=/[\d\u06f0-\u06f9]/;var ke=function(){this.b="";this.f=je};ke.prototype.rd=!0;ke.prototype.nd=function(){return this.b};ke.prototype.toString=function(){return"TrustedResourceUrl{"+this.b+"}"};var le=function(a){if(a instanceof ke&&a.constructor===ke&&a.f===je)return a.b;Fb("expected object of type TrustedResourceUrl, got '"+a+"' of type "+Ra(a));return"type_error:TrustedResourceUrl"},je={},me=function(a){var b=new ke;b.b=a;return b};var oe=function(){this.b="";this.f=ne};oe.prototype.rd=!0;oe.prototype.nd=function(){return this.b};oe.prototype.toString=function(){return"SafeUrl{"+this.b+"}"};
var pe=function(a){if(a instanceof oe&&a.constructor===oe&&a.f===ne)return a.b;Fb("expected object of type SafeUrl, got '"+a+"' of type "+Ra(a));return"type_error:SafeUrl"},qe=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i,se=function(a){if(a instanceof oe)return a;a="object"==typeof a&&a.rd?a.nd():String(a);qe.test(a)||(a="about:invalid#zClosurez");return re(a)},ne={},re=function(a){var b=new oe;b.b=a;return b};re("about:blank");var ue=function(){this.b="";this.f=te};ue.prototype.rd=!0;var te={};ue.prototype.nd=function(){return this.b};ue.prototype.toString=function(){return"SafeStyle{"+this.b+"}"};
var ve=function(a){if(a instanceof ue&&a.constructor===ue&&a.f===te)return a.b;Fb("expected object of type SafeStyle, got '"+a+"' of type "+Ra(a));return"type_error:SafeStyle"},we=function(a){var b=new ue;b.b=a;return b},xe=we(""),ze=function(a){if(a instanceof oe)return'url("'+pe(a).replace(/</g,"%3c").replace(/[\\"]/g,"\\$&")+'")';a=a instanceof $d?ae(a):ye(String(a));if(/[{;}]/.test(a))throw new Eb("Value does not allow [{;}], got: %s.",[a]);return a},ye=function(a){var b=a.replace(Ae,"$1").replace(Ae,
"$1").replace(Be,"url");if(Ce.test(b)){if(De.test(a))return Fb("String value disallows comments, got: "+a),"zClosurez";for(var c=b=!0,d=0;d<a.length;d++){var e=a.charAt(d);"'"==e&&c?b=!b:'"'==e&&b&&(c=!c)}if(!b||!c)return Fb("String value requires balanced quotes, got: "+a),"zClosurez";if(!Ee(a))return Fb("String value requires balanced square brackets and one identifier per pair of brackets, got: "+a),"zClosurez"}else return Fb("String value allows only [-,.\"'%_!# a-zA-Z0-9\\[\\]] and simple functions, got: "+
a),"zClosurez";return Fe(a)},Ee=function(a){for(var b=!0,c=/^[-_a-zA-Z0-9]$/,d=0;d<a.length;d++){var e=a.charAt(d);if("]"==e){if(b)return!1;b=!0}else if("["==e){if(!b)return!1;b=!1}else if(!b&&!c.test(e))return!1}return b},Ce=/^[-,."'%_!# a-zA-Z0-9\[\]]+$/,Be=/\b(url\([ \t\n]*)('[ -&(-\[\]-~]*'|"[ !#-\[\]-~]*"|[!#-&*-\[\]-~]*)([ \t\n]*\))/g,Ae=/\b(hsl|hsla|rgb|rgba|matrix|calc|minmax|fit-content|repeat|(rotate|scale|translate)(X|Y|Z|3d)?)\([-+*/0-9a-z.%\[\], ]+\)/g,De=/\/\*/,Fe=function(a){return a.replace(Be,
function(a,c,d,e){var b="";d=d.replace(/^(['"])(.*)\1$/,function(a,c,d){b=c;return d});a=se(d).nd();return c+b+a+b+e})};var He=function(){this.b="";this.f=Ge};He.prototype.rd=!0;
var Ge={},Je=function(a,b){if(-1!=a.indexOf("<"))throw Error("Selector does not allow '<', got: "+a);var c=a.replace(/('|")((?!\1)[^\r\n\f\\]|\\[\s\S])*\1/g,"");if(!/^[-_a-zA-Z0-9#.:* ,>+~[\]()=^$|]+$/.test(c))throw Error("Selector allows only [-_a-zA-Z0-9#.:* ,>+~[\\]()=^$|] and strings, got: "+a);a:{for(var d={"(":")","[":"]"},e=[],f=0;f<c.length;f++){var h=c[f];if(d[h])e.push(d[h]);else if(Vc(d,h)&&e.pop()!=h){c=!1;break a}}c=0==e.length}if(!c)throw Error("() and [] in selector must be balanced, got: "+a);
if(!(b instanceof ue)){c="";for(var l in b){if(!/^[-_a-zA-Z0-9]+$/.test(l))throw Error("Name allows only [-_a-zA-Z0-9], got: "+l);d=b[l];null!=d&&(d=Ta(d)?Lb(d,ze).join(" "):ze(d),c+=l+":"+d+";")}b=c?we(c):xe}a=a+"{"+ve(b).replace(/</g,"\\3C ")+"}";return Ie(a)},Le=function(a){var b="",c=function(a){Ta(a)?w(a,c):b+=Ke(a)};w(arguments,c);return Ie(b)};He.prototype.nd=function(){return this.b};He.prototype.toString=function(){return"SafeStyleSheet{"+this.b+"}"};
var Ke=function(a){if(a instanceof He&&a.constructor===He&&a.f===Ge)return a.b;Fb("expected object of type SafeStyleSheet, got '"+a+"' of type "+Ra(a));return"type_error:SafeStyleSheet"},Ie=function(a){var b=new He;b.b=a;return b},Me=Ie("");var Oe=function(){this.b="";this.f=Ne;this.ng=null};Oe.prototype.rd=!0;Oe.prototype.nd=function(){return this.b};Oe.prototype.toString=function(){return"SafeHtml{"+this.b+"}"};var Pe=function(a){if(a instanceof Oe&&a.constructor===Oe&&a.f===Ne)return a.b;Fb("expected object of type SafeHtml, got '"+a+"' of type "+Ra(a));return"type_error:SafeHtml"},Ne={},Qe=function(a,b){var c=new Oe;c.b=a;c.ng=b;return c};Qe("<!DOCTYPE html>",0);Qe("",0);Qe("<br>",0);var Re={MATH:!0,SCRIPT:!0,STYLE:!0,SVG:!0,TEMPLATE:!0},Se=function(a){var b=!1,c;return function(){b||(c=a(),b=!0);return c}}(function(){if("undefined"===typeof document)return!1;var a=document.createElement("div");a.innerHTML="<div><div></div></div>";if(!a.firstChild)return!1;var b=a.firstChild.firstChild;a.innerHTML="";return!b.parentElement}),Te=function(a,b){if(Re[a.tagName.toUpperCase()])throw Error("goog.dom.safe.setInnerHtml cannot be used to set content of "+a.tagName+".");b=Pe(b);if(Se())for(;a.lastChild;)a.removeChild(a.lastChild);
a.innerHTML=b},Ue=function(a,b){a.src=le(b);(b=Ma())&&a.setAttribute("nonce",b)};var Ve=function(a,b){return a+Math.random()*(b-a)};var We=function(a,b,c){this.o=a;this.g=b;this.m=c;this.j=0;this.h=!1;this.b=this.f=null};We.prototype.start=function(){if(null!=this.b)throw Error("Cannot call Retry.start more than once.");this.b=new Bb;this.w();return this.b.b};We.prototype.w=function(){var a=this;this.f=null;this.h||(this.j++,this.o().then(function(b){Xe(a);a.b.resolve(b)},function(b){a.j>=a.m?(Xe(a),a.b.reject(b)):(a.f=setTimeout(a.w.bind(a),a.g),a.g*=2)}))};
We.prototype.abort=function(a){Xe(this);this.b.reject(void 0===a?Error("abort"):a)};var Xe=function(a){null!=a.f&&(clearTimeout(a.f),a.f=null);a.h=!0};var Ye=function(a,b){this.g=a;this.h=b;this.b=0;this.f=[]};Ye.prototype.send=function(a,b,c,d){var e=void 0===d?{}:d;d=void 0===e.timeoutMillis?this.h:e.timeoutMillis;var f=void 0===e.xl?1:e.xl,h=void 0===e.headers?null:e.headers;e=void 0===e.responseType?"":e.responseType;a={ub:new Bb,url:a,method:b,headers:h,responseType:e,body:c,timeoutMillis:d,yl:f};this.b<this.g?Ze(this,a):this.f.push(a);return a.ub.b};
var $e=function(a){if(0<a.f.length&&a.b<a.g){var b=a.f.shift();Ze(a,b)}},Ze=function(a,b){a.b++;b.yl--;af(b).then(function(c){b.ub.resolve(c);a.b--;$e(a)},function(c){0==b.yl?b.ub.reject(c):a.f.push(b);a.b--;$e(a)})},af=function(a){return new Promise(function(b,c){var d=new XMLHttpRequest;d.onreadystatechange=function(){d.readyState==XMLHttpRequest.DONE&&b(d)};d.timeout=a.timeoutMillis;d.ontimeout=function(){c(Error("Timed out"))};d.open(a.method,a.url,!0);null==a.headers?d.setRequestHeader("Content-Type",
"application/x-www-form-urlencoded;charset=utf-8"):a.headers.forEach(function(a){return d.setRequestHeader(a[0],a[1])});d.responseType=a.responseType;d.send(a.body)})};var cf=function(a,b,c){null==bf&&(bf=new Ye(1,3E5));var d="https://crash.corp.google.com/samples?reportid=&q="+encodeURIComponent("UserComments='"+b+"'"),e="http://"+a+":8008/setup/send_log_report";bf.send(e,"POST",JSON.stringify({uuid:b}),{headers:[["Content-Type","application/json"]]}).then(function(a){200==a.status?c("ok",d):c("error","Unable to POST to "+e+", "+("error = "+a.status))},function(a){c("error",String(a))});return d},ff=function(a){var b=new df;if("string"!==typeof a)return Promise.resolve(b);
null==ef&&(ef=new Ye(1,3E3));return ef.send("http://"+a+":8008/setup/eureka_info","GET",void 0,{responseType:"text"}).then(function(a){a=JSON.parse(a.responseText);"cast_build_revision"in a?b.b=String(a.cast_build_revision):"build_version"in a&&(b.b=String(a.build_version));"connected"in a&&(b.h="true"==String(a.connected));"ethernet_connected"in a&&(b.f="true"==String(a.ethernet_connected));"has_update"in a&&(b.g="true"==String(a.has_update));"uptime"in a&&(a=Number(a.uptime),Number.isFinite(a)&&
(b.j=a))}).catch(function(a){fb("mr.DongleUtils").H("Unable to fetch/parse setup info.",a)}).then(function(){return b})},df=function(){this.j=this.g=this.f=this.h=this.b=null},bf=null,ef=null;var gf=function(a,b,c){this.source=a;this.type=b;this.message=c};var hf=function(a){var b=[],c=[],d={},e=function(a,h){var f=h+"  ";try{if(Ha(a))if(null===a)b.push("NULL");else if(Ia(a))b.push('"'+a.replace(/\n/g,"\n"+h)+'"');else if(Va(a))b.push(String(a).replace(/\n/g,"\n"+h));else if(Wa(a)){a[Xa]||c.push(a);var r=a[Xa]||(a[Xa]=++Za);if(d[r])b.push("*** reference loop detected (id="+r+") ***");else{d[r]=!0;b.push("{");for(var y in a)Va(a[y])||(b.push("\n"),b.push(f),b.push(y+" = "),e(a[y],f));b.push("\n"+h+"}");delete d[r]}}else b.push(a);else b.push("undefined")}catch(A){b.push("*** "+
A+" ***")}};e(a,"");for(a=0;a<c.length;a++)Ya(c[a]);return b.join("")},jf=function(a){var b=jf;var c=Error();if(Error.captureStackTrace)Error.captureStackTrace(c,b),b=String(c.stack);else{try{throw c;}catch(e){c=e}b=(b=c.stack)?String(b):null}if(b)return b;b=[];c=arguments.callee.caller;for(var d=0;c&&(!a||d<a);){b.push(kf(c));b.push("()\n");try{c=c.caller}catch(e){b.push("[exception trying to get caller]\n");break}d++;if(50<=d){b.push("[...long stack...]");break}}a&&d>=a?b.push("[...reached max depth limit...]"):
b.push("[end]");return b.join("")},kf=function(a){if(lf[a])return lf[a];a=String(a);if(!lf[a]){var b=/function\s+([^\(]+)/m.exec(a);lf[a]=b?b[1]:"[Anonymous]"}return lf[a]},lf={},mf=Object.freeze||function(a){return a};var nf=function(a,b,c){this.reset(a,b,c,void 0,void 0)};nf.prototype.b=null;var of=0;nf.prototype.reset=function(a,b,c,d,e){"number"==typeof e||of++;this.j=d||t();this.f=a;this.h=b;this.g=c;delete this.b};nf.prototype.getMessage=function(){return this.h};var pf=function(a){this.j=a;this.b=this.h=this.f=this.g=null},qf=function(a,b){this.name=a;this.value=b};qf.prototype.toString=function(){return this.name};var rf=new qf("SEVERE",1E3),sf=new qf("WARNING",900),tf=new qf("INFO",800),uf=new qf("CONFIG",700),vf=new qf("FINE",500),wf=new qf("FINER",400),xf=new qf("ALL",0);pf.prototype.getName=function(){return this.j};pf.prototype.getChildren=function(){this.h||(this.h={});return this.h};
var yf=function(a){if(a.f)return a.f;if(a.g)return yf(a.g);Fb("Root logger has no level set.");return null};g=pf.prototype;g.log=function(a,b,c){a.value>=yf(this).value&&(Va(b)&&(b=b()),a=new nf(a,String(b),this.j),c&&(a.b=c),zf(this,a))};g.H=function(a,b){this.log(sf,a,b)};g.info=function(a,b){this.log(tf,a,b)};g.config=function(a,b){this.log(uf,a,b)};g.logRecord=function(a){a.f.value>=yf(this).value&&zf(this,a)};
var zf=function(a,b){for(;a;){var c,d=a,e=b;if(d.b)for(var f=0;c=d.b[f];f++)c(e);a=a.g}},Af={},Bf=null,Cf=function(){Bf||(Bf=new pf(""),Af[""]=Bf,Bf.f=uf)},Df=function(a){Cf();var b;if(!(b=Af[a])){b=new pf(a);var c=a.lastIndexOf("."),d=a.substr(c+1);c=Df(a.substr(0,c));c.getChildren()[d]=b;b.g=c;Af[a]=b}return b};var Ef=function(a,b,c,d){a&&a.log(b,c,d)},Ff=function(a,b,c){a&&a.log(rf,b,c)},z=function(a,b,c){a&&a.H(b,c)},B=function(a,b){a&&a.info(b,void 0)},Gf=function(a,b){a&&a.log(vf,b,void 0)};var Hf=!qd&&!od||od&&9<=Number(Jd)||qd&&Id("1.9.1");var If=function(a,b){this.width=a;this.height=b};g=If.prototype;g.clone=function(){return new If(this.width,this.height)};g.toString=function(){return"("+this.width+" x "+this.height+")"};g.aspectRatio=function(){return this.width/this.height};g.Ob=function(){return!(this.width*this.height)};g.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};g.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};
g.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};var Jf={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"},Kf=function(a){a=a.document;a="CSS1Compat"==a.compatMode?a.documentElement:a.body;return new If(a.clientWidth,a.clientHeight)},Lf=function(a){return a?a.parentWindow||a.defaultView:window},Mf=function(a){for(var b;b=a.firstChild;)a.removeChild(b)},Nf=function(a){return a&&
a.parentNode?a.parentNode.removeChild(a):null},Of=function(a){return 9==a.nodeType?a:a.ownerDocument||a.document},Pf=function(a,b){if("textContent"in a)a.textContent=b;else if(3==a.nodeType)a.data=String(b);else if(a.firstChild&&3==a.firstChild.nodeType){for(;a.lastChild!=a.firstChild;)a.removeChild(a.lastChild);a.firstChild.data=String(b)}else Mf(a),a.appendChild(Of(a).createTextNode(String(b)))},Qf=function(a){this.b=a||Ga.document||document};g=Qf.prototype;
g.setProperties=function(a,b){Nc(b,function(c,b){c&&"object"==typeof c&&c.rd&&(c=c.nd());"style"==b?a.style.cssText=c:"class"==b?a.className=c:"for"==b?a.htmlFor=c:Jf.hasOwnProperty(b)?a.setAttribute(Jf[b],c):oc(b,"aria-")||oc(b,"data-")?a.setAttribute(b,c):a[b]=c})};g.appendChild=function(a,b){a.appendChild(b)};g.ap=Nf;g.getChildren=function(a){return Hf&&void 0!=a.children?a.children:Kb(a.childNodes,function(a){return 1==a.nodeType})};g.isElement=function(a){return Wa(a)&&1==a.nodeType};
g.contains=function(a,b){if(!a||!b)return!1;if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||!!(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a};var Rf=function(a){this.b="number"==typeof a?0<a?1:0>a?-1:null:null==a?null:a?-1:1};
