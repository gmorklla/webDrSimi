'use strict';

/**
 * @ngdoc service
 * @name drsimiApp.Auth
 * @description: request get genérico
 * # Auth
 * Factory in the drsimiApp.
 */
angular.module('drsimiApp')
  .factory('Auth', ['$firebaseAuth', function ($firebaseAuth) {

    return $firebaseAuth();

  }]);