'use strict';

/**
 * @ngdoc function
 * @name drsimiApp.controller:CienciaCtrl
 * @description
 * # CienciaCtrl
 * Controller of the drsimiApp
 */
angular.module('drsimiApp')
  .controller('CienciaCtrl', function ($scope, $rootScope, Compile) {
  	$scope.addAnim = function () {  		
  		cModalMathGame();
  	}

  	// Cierra Juego modal de Mundo Simi con animación personalizada
    $rootScope.cierraJuegoMath = function() {
        $scope.marcadores = false;
        $('#juegoMathSimi').removeClass('bounceInUp').addClass('bounceOutUp');
        $rootScope.cierraJuego();
        setTimeout(function() {
            $('#juegoMathSimi').modal('hide');
            $('#juegoMathSimi').removeClass('bounceOutUp');                    
        }, 1000);
    };

    $rootScope.getScoreFromMathFrame = function(data) {
        alert(data);
    };

  	function cModalMathGame() {
        $("#cModalMathGame").load("views/mathGameModal.html", function() {
            Compile.thisHtml($("#cModalMathGame"), $scope);
            $('#juegoMathSimi').addClass('bounceInUp');
            $('#juegoMathSimi').modal({ backdrop: 'static', keyboard: false });
            $('#juegoMathSimi').modal('show');
            $('#gameMathContent').append('<iframe id="gameIframe" src="unity/mathGame/index.html" frameborder="0" height="650" width="100%" scrolling="no"></iframe>');
            $('#gameIframe').focus();
        });
    }

  });
