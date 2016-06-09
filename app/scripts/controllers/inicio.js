'use strict';

/**
 * @ngdoc function
 * @name drsimiApp.controller:InicioCtrl
 * @description
 * # InicioCtrl
 * Controller of the drsimiApp
 */
angular.module('drsimiApp')
    .controller('InicioCtrl', function($scope, $rootScope, loadData, Compile) {
        $scope.panelAbierto = false;
        $(document).ready(function() {
            $('#castle').addClass('animated zoomInUp');
            $('#logo').addClass('animated bounceInUp');
            $('.btn').hover(function(e) {
                var obj = $(this);
                obj.addClass('animated tada');
                TweenLite.to(obj, 0.5, { borderRadius: "15px" });
                obj.tooltip('show');
                $('.tooltip').removeClass('fade');
                $('.tooltip').addClass('animated rubberBand');
            }, function(e) {
                var obj = $(this);
                obj.removeClass('animated tada');
                obj.tooltip('hide');
                TweenLite.to(obj, 0.5, { borderRadius: "21px" });
            });

            var options = {
                placement: 'bottom',
                container: 'body'
            }

            $('.btn').tooltip(options);

            // Abre Ediciones modal de Mundo Simi con animación personalizada
            $('#btnEdicionesModal').click(function(event) {
                cargaDatos();
                cModalEdiciones();
            });

            // Cierra Ediciones modal de Mundo Simi con animación personalizada
            $rootScope.cierraEdiciones = function() {
                $('#ediciones').removeClass('bounceInUp').addClass('bounceOutUp');
                setTimeout(function() {
                    $('#ediciones').modal('hide');
                    $('#ediciones').removeClass('bounceOutUp');
                }, 1000);
            }

            // Abre Juego modal de Mundo Simi con animación personalizada
            $('#btnJuegoModal').click(function(event) {
                cModalSpaceGame();
            });

            // Cierra Juego modal de Mundo Simi con animación personalizada
            $rootScope.cierraJuegoMundoSimi = function() {
                $('#juegoMundoSimi').removeClass('bounceInUp').addClass('bounceOutUp');
                $rootScope.cierraJuego();
                setTimeout(function() {
                    $('#juegoMundoSimi').modal('hide');
                    $('#juegoMundoSimi').removeClass('bounceOutUp');
                }, 1000);
            }            

        });

        function cargaDatos() {
            // Usa servicio 'loadData.httpReq' para obtener datos de los anuncios
            var datos = loadData.httpReq('data/mundo-simi.json');

            datos.then(function(datos) {
                $rootScope.ejemplares = datos.data.ejemplares;
            }, function(e) {
                console.log(e);
            });
        };

        function cModalEdiciones() {
            $( "#cModalEdiciones" ).load( "views/edicionesModal.html", function () {
                Compile.thisHtml($( "#cModalEdiciones" ), $scope);
                $('#ediciones').addClass('bounceInUp');
                $('#ediciones').modal({ backdrop: 'static', keyboard: false });
                $('#ediciones').modal('show');                
            } );
        };

        function cModalSpaceGame() {
            $( "#cModalSpaceGame" ).load( "views/espacioGameModal.html", function () {
                Compile.thisHtml($( "#cModalSpaceGame" ), $scope);
                $('#juegoMundoSimi').addClass('bounceInUp');
                $('#juegoMundoSimi').modal({ backdrop: 'static', keyboard: false });
                $('#juegoMundoSimi').modal('show');
                $rootScope.cargarJuego();
                $('#gameContent').append('<iframe id="gameIframe" src="unity/intoTheSpace/index.html" frameborder="0" height="550px" width="400px" scrolling="no"></iframe>');
                $('#gameIframe').focus();
            } );
        };

        $scope.noGuardes = function () {
            $('#guardaPrompt').removeClass('bounceInUp').addClass('bounceOutUp');
            setTimeout(function() {
                $('#guardaPrompt').removeClass('bounceOutUp');
                $rootScope.guardaPrompt = false;
                digiere();
            }, 1000);            
        };

        $scope.siGuarda = function () {
            $scope.loadingGame = true;
            var user = firebase.auth().currentUser;

            if (user) {
                // El usuario está logeado, carga sus 5 resultados y compara, sólo se graban los más altos puntajes
                firebase.database().ref('juegos/space/' + user.uid).on('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        console.log(childSnapshot);
                    });
                });

                /*firebase.database().ref('juegos/space/' + user.uid).push({
                    score: $scope.score
                }).then(function(data){
                    $scope.scoreGuardado = true;
                    digiere();
                    $scope.noGuardes();
                    $scope.loadingGame = false;
                }).catch(function(error) {
                    // Handle Errors here.
                    console.log(error);
                });*/

            } else {
              // No user is signed in.
              console.log('Primero debes entrar');
              $scope.loadingGame = false;
            }            
        };        

        $rootScope.guardaPrompt = false;

        $rootScope.getScoreFromUnity = function (data) {
            $('#guardaPrompt').addClass('bounceInUp');
            $scope.scoreGuardado = false;
            $rootScope.guardaPrompt = true;
            $scope.score = data;
        };

        $scope.getScores = function () {
            $scope.loadingGame = true;
            $scope.marcadores = true;
            digiere();
            firebase.database().ref('juegos/space').on('value', function(snapshot) {
                console.log(snapshot.val());
            });            
        }

        // Procesa datos que angular todavía no ha digerido
        function digiere() {
            if(!$scope.$$phase) {
                $scope.$digest();
            }                
        }        

    });
