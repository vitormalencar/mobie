(function (window, angular, undefined) {function LeftbarController(e,r){e.pages=_(r).filter(function(e){return e.area}).groupBy("area").mapValues(function(e,r){return _.groupBy(e,"module")}).mapValues(function(e,r){return _(e).mapValues(function(e,r){return _.groupBy(e,"docType")}).value()}).value()}LeftbarController.$inject=["$scope","pagesData"],angular.module("docsApp",["ngAnimate","ngRoute","pagesData"]).controller("LeftbarController",LeftbarController).config(["$routeProvider","pagesDataProvider",function(e,r){var a=r.pages,t="/";_(a).filter(function(e){return e.area&&e.module&&e.docType&&e.name}).forEach(function(a){var o=r.resolve(a);o=path.resolve(t,o),e.when(o,{templateUrl:path.join("partials",a.partialPath+".html")})}).value()}]);}(window, angular, undefined));