'use strict';

/**
 * @ngdoc function
 * @name drsimiApp.controller:InicioCtrl
 * @description
 * # InicioCtrl
 * Controller of the drsimiApp
 */
angular.module('drsimiApp')
    .controller('InicioCtrl', function($scope, $rootScope, loadData, Compile, FirebaseRTData) {
        $scope.panelAbierto = false;
        $(document).ready(function() {
            $('#castle').addClass('animated zoomInUp');
            $('#logo').addClass('animated bounceInUp');

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
            };

            // Abre Juego modal de Mundo Simi con animación personalizada
            $('#btnJuegoModal').click(function(event) {
                cModalSpaceGame();
            });

            // Cierra Juego modal de Mundo Simi con animación personalizada
            $rootScope.cierraJuegoMundoSimi = function() {
                $scope.marcadores = false;
                $('#juegoMundoSimi').removeClass('bounceInUp').addClass('bounceOutUp');
                $rootScope.cierraJuego();
                setTimeout(function() {
                    $('#juegoMundoSimi').modal('hide');
                    $('#juegoMundoSimi').removeClass('bounceOutUp');                    
                }, 1000);
            };

        });

        function cargaDatos() {
            // Usa servicio 'loadData.httpReq' para obtener datos de los números del Mundo del dr. Simi
            var datos = loadData.httpReq('data/mundo-simi.json');

            datos.then(function(datos) {
                $rootScope.ejemplares = datos.data.ejemplares;
            }, function(e) {
                console.log(e);
            });
        }

        function cModalEdiciones() {
            $("#cModalEdiciones").load("views/edicionesModal.html", function() {
                Compile.thisHtml($("#cModalEdiciones"), $scope);
                $('#ediciones').addClass('bounceInUp');
                $('#ediciones').modal({ backdrop: 'static', keyboard: false });
                $('#ediciones').modal('show');
            });
        }

        function cModalSpaceGame() {
            $("#cModalSpaceGame").load("views/espacioGameModal.html", function() {
                Compile.thisHtml($("#cModalSpaceGame"), $scope);
                $('#juegoMundoSimi').addClass('bounceInUp');
                $('#juegoMundoSimi').modal({ backdrop: 'static', keyboard: false });
                $('#juegoMundoSimi').modal('show');
                $rootScope.cargarJuego();
                $('#gameContent').append('<iframe id="gameIframe" src="unity/intoTheSpace/index.html" frameborder="0" height="550px" width="400px" scrolling="no"></iframe>');
                $('#gameIframe').focus();
            });
        }

        $scope.noGuardes = function() {
            $('#guardaPrompt').removeClass('bounceInUp').addClass('bounceOutUp');
            setTimeout(function() {
                $('#guardaPrompt').removeClass('bounceOutUp');
                $rootScope.guardaPrompt = false;
                digiere();
            }, 1000);
        };

        $scope.siGuarda = function() {
            $scope.loadingGame = true;
            var user = firebase.auth().currentUser;

            if (user) {
                // El usuario está logeado, carga su resultado guardado y compara, sólo se graba el más alto puntaje

                var ref = FirebaseRTData.ref('usuarios/' + user.displayName);
                ref.once("value").then(function(snapshot) {
                    var childKey = snapshot.val();
                    // Guarda marcador porque el score es mayor que el guardado
                    if($scope.score > childKey.space || !childKey.space) {
                        // Objeto que se guardará en el registro del usuario
                        var obj = {
                            'space': $scope.score
                        };
                        // Se hace el update en la referencia
                        ref.update(obj).then(function(){
                            // Referencia del juego donde se guardan los scores de todos los usuarios
                            var refGame = FirebaseRTData.ref('juegos/space');
                            var nameKey = user.displayName;
                            // Objeto que se guardará en la referencia del juego
                            var obj2 = {};
                            obj2[nameKey] = $scope.score;
                            // Se hace el update en la referencia del juego
                            refGame.update(obj2).then(function(){
                                console.log('Guardado');
                            }).catch(function (error) {
                                // Handle Errors here.
                                console.log(error);                                
                            });
                            // Función que maneja el guardado de los scores
                            handleScoreGuardado();
                        }).catch(function(error) {
                            // Handle Errors here.
                            console.log(error);
                        });
                    // No guarda el score porque es menor que el guardado
                    } else {
                        handleScoreMuyBajo();
                    }
                });
            // No se puede guardar porque el usuario no ha ingresado
            } else {
                console.log('Primero debes entrar');
                $scope.loadingGame = false;
            }
        };

        function handleScoreGuardado() {
            $scope.noValeLaPena = false;
            $scope.scoreGuardado = true;
            digiere();
            $scope.noGuardes();
            $scope.loadingGame = false;            
        }

        function handleScoreMuyBajo() {
            $scope.scoreGuardado = true;
            $scope.noValeLaPena = true;
            $scope.noGuardes();
            $scope.loadingGame = false;
        }

        $rootScope.guardaPrompt = false;

        $rootScope.getScoreFromUnity = function(data) {
            $('#guardaPrompt').addClass('bounceInUp');
            $scope.scoreGuardado = false;
            $rootScope.guardaPrompt = true;
            $scope.score = data;
        };

        $scope.getScores = function() {
            $scope.loadingGame = true;
            $scope.marcadores = true;
            digiere();
            var ref = FirebaseRTData.ref('juegos/space');
            ref.once("value").then(function(snapshot) {
                var valores = snapshot.val();
                $scope.allScores = [];
                for(var i in valores){
                    var score = {
                        'nombre': i,
                        'score': valores[i]
                    };
                    $scope.allScores.push(score);
                }
                $scope.loadingGame = false;
                digiere();
            });

        };

        $scope.cerrarRanking = function () {
            $scope.marcadores = false;
        };

        // Procesa datos que angular todavía no ha digerido
        function digiere() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        }

    });
