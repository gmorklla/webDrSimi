'use strict';

/**
 * @ngdoc function
 * @name drsimiApp.controller:AvisosCtrl
 * @description
 * # AvisosCtrl
 * Controller of the drsimiApp
 */
angular.module('drsimiApp')
    .controller('AvisosCtrl', function($scope, FirebaseRTData) {
    	
    	var refGame = FirebaseRTData.ref('juegos/space');
		refGame.on('child_changed', function(childSnapshot) {
			var quien = childSnapshot.key;
			var score = childSnapshot.val();
			var aviso = '¡' + quien + ' acaba de hacer ' + score + ' pts. en la Odisea espacial!';
			putAlert(aviso);
/*            setTimeout(function() {
                $scope.aviso = null;
                $('.avisos').addClass('fadeOutUp');
                setTimeout(function() {
                	digiere();
                }, 1000);
            }, 4000);*/
		});

		$scope.avisosArray = [];

		function putAlert(aviso) {
			$scope.avisosArray.push(aviso);
			console.log($scope.avisosArray);
			// $('.avisos').removeClass('fadeOutUp');
			digiere();			
		}

        // Procesa datos que angular todavía no ha digerido
        function digiere() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        }
    });
