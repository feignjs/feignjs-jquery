(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FeignJquery = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Args = (window.Args);
var jq = (window.jQuery);
var _ = (window._)
 
if (typeof window === 'undefined') { // Running in NodeJS
  var domino=require('domino');
  jq=jq(domino.createWindow());
  var XMLHttpRequest=require('xmlhttprequest').XMLHttpRequest;
  jq.support.cors=true; // cross domain
  jq.ajaxSettings.xhr=function(){return new XMLHttpRequest();};
};


function FeignJqueryClient(){
  var args  = Args([
      { defaults: Args.OBJECT | Args. Optional, _default: {}},
      { jQuery: Args.ANY | Args.Optional, _default: jq}
    ], arguments);

  this.jQuery = args.jQuery;
  this.defaults = args.defaults;
}

FeignJqueryClient.prototype.request =  function(request){
  var options = this._createJQueryJsOptions(request.baseUrl, request.options, request.parameters);
  var _this = this;
  var promise = new Promise(function(resolve, reject){
    _this.jQuery.ajax(options).then(function(data, status, jqXHR){
        return resolve({raw: jqXHR, body: data});
    }, function( jqXHR, textStatus, errorThrown ){
      return reject({status: jqXHR.status, message: jqXHR.responseText});
    });
  });
  return promise;
};

FeignJqueryClient.prototype._createJQueryJsOptions = function(baseUrl, requestOptions, parameters){
  var options  = Args([
      { method: Args.STRING | Args.Optional, _default: 'GET' },
      { uri: Args.STRING | Args.Required}
    ], [requestOptions]);

    
    var jqSettings = _.defaults({
      url: baseUrl + options.uri,
      method: options.method
    }, this.defaults);
    if (parameters != null){
      jqSettings.data = parameters;
    }
  
  return jqSettings;
};


module.exports = FeignJqueryClient;
},{"domino":undefined,"xmlhttprequest":undefined}]},{},[1])(1)
});