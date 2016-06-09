'use strict';

/**
 * @ngdoc function
 * @name drsimiApp.controller:CienciaCtrl
 * @description
 * # CienciaCtrl
 * Controller of the drsimiApp
 */
angular.module('drsimiApp')
  .controller('CienciaCtrl', function ($scope) {
  	$scope.addAnim = function (obj) {  		
  		$('#'+obj).addClass('animated shake');
  	}
  });
