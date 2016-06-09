'use strict';

/**
 * @ngdoc service
 * @name drsimiApp.Compile
 * @description: request get genérico
 * # Compile
 * Factory in the drsimiApp.
 */
angular.module('drsimiApp')
  .factory('Compile', ['$compile', function ($compile) {

    return {
      thisHtml: function(html, scope) {
         return $compile( html )( scope );
      }
    };

  }]);