'use strict';

/**
 * @ngdoc service
 * @name drsimiApp.loadData
 * @description: request get genérico
 * # loadData
 * Service in the drsimiApp.
 */
angular.module('drsimiApp')
  .service('loadData', ['$http', function ($http) {

    return {
      httpReq: function(url) {
         return $http.get(url);
      }
    };

  }]);