'use strict';

/**
 * @ngdoc function
 * @name drsimiApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the drsimiApp
 */
angular.module('drsimiApp')
    .controller('NavCtrl', function($scope, $state, $rootScope, Compile) {

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
        }

        function navegar(arg) {
            $state.go(arg);
        }

        // Abre Login modal con animación personalizada
        $scope.loginOpenModal = function () {
            $( "#cModalLogin" ).load( "views/loginModal.html", function () {
                Compile.thisHtml($( "#cModalLogin" ), $scope);
                $('#loginModal').addClass('bounceInUp');
                $('#loginModal').modal({ backdrop: 'static', keyboard: false });
                $('#loginModal').modal('show');               
            } );            
        }

        // Cierra Juego modal de Mundo Simi con animación personalizada
        $rootScope.cierraLogin = function() {
            $('#loginModal').removeClass('bounceInUp').addClass('bounceOutUp');
            setTimeout(function() {
                $('#loginModal').modal('hide');
                $('#loginModal').removeClass('bounceOutUp');
            }, 1000);
        }

        $rootScope.checkPass = function () {
            if ($scope.password != $scope.passwordCheck) {
                document.getElementById('inputPasswordCheck').setCustomValidity("La contraseña no coincide");
                $scope.loginForm.$invalid = true;
            } else {
                document.getElementById('inputPasswordCheck').setCustomValidity("");
                $scope.loginForm.$invalid = false;
            }
        }

        // Crear usuario con Firebase
        $rootScope.crearUsuario = function() {
            $scope.message = null;
            $scope.error = null;
            if ($scope.loginForm.$invalid) {
                return;
            } else {
                // Create a new user
                firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).then(function (userData) {
                    displayName(userData);
                }).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorCode);
                });
            }
        };

        // Auth con Firebase
        $rootScope.iniciarSesion = function() {
            $scope.message = null;
            $scope.error = null;
            if ($scope.loginForm.$invalid) {
                return;
            } else {
                // Create a new user
                $rootScope.loadingOnModal = true;
                firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).then(function (user) {                            
                    $rootScope.usuario = user.displayName;
                    $rootScope.loadingOnModal = false;
                    digiere();
                }).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(error);
                });
            }
        };

        // Sign out Firebase
        $rootScope.signOut = function () {
            firebase.auth().signOut().then(function() {
              // Sign-out successful.
              $rootScope.usuario = '';
              digiere();              
            }, function(error) {
              // An error happened.
              console.log(error);
            });            
        }

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

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            $rootScope.usuario = user.displayName;
            digiere();
          } else {
            // No user is signed in.
            console.log('No hay usuario logeado');
          }
        });

        function displayName(user) {
            // Updates the user attributes:
            user.updateProfile({
              displayName: $scope.nombreDeUsuario,
              photoURL: null
            }).then(function() {
              // Profile updated successfully!
              $rootScope.usuario = user.displayName;
              digiere();
            }, function(error) {
              // An error happened.
            });                    
        }

        // Procesa datos que angular todavía no ha digerido
        function digiere() {
            if(!$scope.$$phase) {
                $scope.$digest();
            }                
        }

    });
