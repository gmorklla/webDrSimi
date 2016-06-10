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
            };

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
            // Usa servicio 'loadData.httpReq' para obtener datos de los anuncios
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
                // El usuario está logeado, carga sus 5 resultados y compara, sólo se graban los más altos puntajes

                var ref = FirebaseRTData.ref('juegos/space/' + user.uid);
                ref.once("value").then(function(snapshot) {
                    var childKey = snapshot.val();
                    $scope.playerScores = childKey;
                    if(childKey){

                        var nRegistros = _.size(childKey);

                        switch(nRegistros) {
                            case 1:
                                guardaScore('score2', ref, childKey);
                                break;
                            case 2:
                                guardaScore('score3', ref, childKey);
                                break; 
                            case 3:
                                guardaScore(null, ref, childKey);
                                break;
                        }

                    } else {

                        guardaScore('score1', ref, null);

                    }
                });

            } else {
                // No user is signed in.
                console.log('Primero debes entrar');
                $scope.loadingGame = false;
            }
        };

        function guardaScore(scoreTag, ref, obj) {
            if(obj) {
                if(scoreTag) {
                    obj[scoreTag] = $scope.score;
                    ref.set(obj).then(function(){
                        handleScoreGuardado();
                    }).catch(function(error) {
                        // Handle Errors here.
                        console.log(error);
                    });
                } else {
                    var keys = _.keys(obj);
                    var valores = _.values(obj);
                    var vMin = _.min(valores);
                    if($scope.score > vMin) {
                        var idx = _.findIndex(valores, function(num){ return num === vMin; });
                        var reemplaza = keys[idx];
                        obj[reemplaza] = $scope.score;
                        ref.set(obj).then(function(){
                            handleScoreGuardado();
                        }).catch(function(error) {
                            // Handle Errors here.
                            console.log(error);
                        });                        
                    } else {
                        handleScoreMuyBajo();
                    }
                    //console.log(keys[idx], vMin);
                }
            } else {
                obj = {};
                obj[scoreTag] = $scope.score;
                ref.set(obj).then(function(data){
                    handleScoreGuardado();
                }).catch(function(error) {
                    // Handle Errors here.
                    console.log(error);
                });
            }                
        }

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
            if($scope.playerScores) {
                $scope.loadingGame = false;
            }
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
