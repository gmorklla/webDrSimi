'use strict';

/**
 * @ngdoc function
 * @name drsimiApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the drsimiApp
 */
angular.module('drsimiApp')
    .controller('NavCtrl', function($scope, $state, $rootScope, Compile, FirebaseRTData) {

        $rootScope.usuario = '';

        $scope.goTo = function(arg) {
            if ($('#castle')) {
                $('#castle').addClass('animated zoomOutUp');
                $('#logo').addClass('animated bounceOut');
                setTimeout(function() { irA(); }, 1000);
            } else {
                navegar(arg);
            }

            function irA() {
                navegar(arg);
            }
        };

        function navegar(arg) {
            $state.go(arg);
        }

        // Abre Login modal con animación personalizada
        $scope.loginOpenModal = function() {
            $("#cModalLogin").load("views/loginModal.html", function() {
                Compile.thisHtml($("#cModalLogin"), $scope);
                $('#loginModal').addClass('bounceInUp');
                $('#loginModal').modal({ backdrop: 'static', keyboard: false });
                $('#loginModal').modal('show');
            });
        };

        // Cierra Juego modal de Mundo Simi con animación personalizada
        $rootScope.cierraLogin = function() {
            $('#loginModal').removeClass('bounceInUp').addClass('bounceOutUp');
            setTimeout(function() {
                $('#loginModal').modal('hide');
                $('#loginModal').removeClass('bounceOutUp');
            }, 1000);
        };

        $rootScope.checkPass = function() {
            if ($scope.password !== $scope.passwordCheck) {
                document.getElementById('inputPasswordCheck').setCustomValidity("La contraseña no coincide");
                $scope.loginForm.$invalid = true;
            } else {
                document.getElementById('inputPasswordCheck').setCustomValidity("");
                $scope.loginForm.$invalid = false;
            }
        };

        // Crear usuario con Firebase
        $scope.crearUsuario = function() {
            $scope.message = null;
            $scope.error = null;
            if ($scope.loginForm.$invalid) {
                return;
            } else {
                // Create a new user
                $rootScope.loadingOnModal = true;
                var creando = FirebaseRTData.createUser($scope.email, $scope.password);
                creando.then(function(userData) {
                    displayName(userData);
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode);
                });
            }
        };

        // Log in Firebase
        $scope.iniciarSesion = function() {
            $scope.message = null;
            $scope.error = null;
            if ($scope.loginForm.$invalid) {
                return;
            } else {
                // Create a new user
                $rootScope.loadingOnModal = true;
                var logeando = FirebaseRTData.logIn($scope.email, $scope.password);
                logeando.then(function (datos) {
                    $rootScope.usuario = datos.displayName;
                    $rootScope.loadingOnModal = false;
                    digiere();                    
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    $rootScope.loadingOnModal = false;                                    
                    $scope.error = "Ups, parece que tus datos son incorrectos, por favor verifícalos.";
                    digiere();
                });
            }
        };

        // Sign out Firebase
        $scope.signOut = function() {
            FirebaseRTData.logOut().then(function() {
                // Sign-out successful.
                $rootScope.usuario = '';
                digiere();
            }, function(error) {
                // An error happened.
                console.log(error);
            });
        };

        $scope.deleteUser = function() {
            $scope.message = null;
            $scope.error = null;

            // Delete the currently signed-in user
            $scope.$deleteUser().then(function() {
                $scope.message = "User deleted";
            }).catch(function(error) {
                $scope.error = error;
            });
        };

        var usuarioLogInOrOut = FirebaseRTData.checkLogInUser(function(user) {
            if (user) {
                // User is signed in.
                $rootScope.usuario = user.displayName;
                digiere();
            } else {
                // No user is signed in.
                console.log('No hay usuario logeado');
            }
        });

        /*        var usuarioLogInOrOut = FirebaseRTData.checkLogInUser();
                usuarioLogInOrOut.then(function(datos) {
                    console.log(datos);
                }, function(e) {
                    console.log(e);
                });*/

        function displayName(user) {
            // Updates the user attributes:
            user.updateProfile({
                displayName: $scope.nombreDeUsuario,
                photoURL: null
            }).then(function() {
                // Profile updated successfully!
                $rootScope.loadingOnModal = false;
                $rootScope.usuario = user.displayName;
                digiere();
            }, function(error) {
                // An error happened.
                console.log(error);
            });
        }

        // Procesa datos que angular todavía no ha digerido
        function digiere() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        }

    });
