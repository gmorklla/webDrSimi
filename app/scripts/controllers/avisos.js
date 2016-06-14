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
		});

		$scope.avisosArray = [];

		function putAlert(aviso) {
			$scope.avisosArray.push(aviso);
			var indice = $scope.avisosArray.length - 1;
			pullAlert(indice);
			digiere();			
		}

		function pullAlert(indice) {
			var stringToSearch = $scope.avisosArray[indice];
			var selector = "p:contains('" + stringToSearch + "')";			
			setTimeout(function () {
				$( selector ).removeClass('fadeInUp').addClass('fadeOutUp');
			}, 3000);
			$scope.avisosArray = $scope.avisosArray.splice(indice, 1);
		}

        // Procesa datos que angular todavía no ha digerido
        function digiere() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        }
    });
