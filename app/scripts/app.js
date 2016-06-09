'use strict';

/**
 * @ngdoc overview
 * @name drsimiApp
 * @description
 * # drsimiApp
 *
 * Main module of the application.
 */
angular
    .module('drsimiApp', [
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'angularUtils.directives.dirPagination',
        'firebase'
    ])
    .config(function($routeProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('inicio', {
                url: "/",
                templateUrl: "views/inicio.html",
                controller: 'InicioCtrl',
                controllerAs: 'inicio'
            })
            .state('ciencia', {
                url: "/ciencia",
                templateUrl: "views/ciencia.html",
                controller: 'CienciaCtrl',
                controllerAs: 'ciencia'
            });
        $urlRouterProvider.otherwise("/");
    })
    .run(function($rootScope) {
        // Pantalla completa para el loader principal
        var w = window.innerWidth;
        var h = window.innerHeight;
        var elemento = document.getElementById('loading');
        elemento.setAttribute("style", "width:" + w + "px");
        elemento.setAttribute("style", "height:" + h + "px");

        $(document).ready(function() {

            var options = {
                effectWeight: 1,
                outerBuffer: 1.05,
                elementDepth: 200,
                perspectiveMulti: 1.5,
                enableSmoothing: true
            };
            var particles = {
                dotColor: '#D0FCFF',
                lineColor: '#BFFBFF',
                density: 30000,
                particleRadius: 5,
                proximity: 100,
                parallax: false
            };
            var particleDensity;

            $('#dropdown').on('hover', function(e) {
                e.stopPropagation();
                $('[data-toggle="dropdown"]').dropdown('toggle');
            });

            var newHtml = '<div id="particle-target"></div><img class="parallaxFx" src="images/planetas.png" /><img class="parallaxFx" src="images/mountainsBg.png" /><img class="parallaxFx" src="images/mountainsFr.png" /><img class="parallaxFx" src="images/ground.png" />';            
            $('#demo1').html(newHtml);

            $('#demo1').logosDistort(options);
            $('#particle-target').particleground(particles);

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

            $rootScope.cargarJuego = function () {
                $('#particle-target').particleground('destroy');
                $('#demo1').remove();
                var newHtml = '<div id="demo1"><div id="particle-target"></div><img class="parallaxFx" src="images/planetas.png" /><img class="parallaxFx" src="images/mountainsBg.png" /><img class="parallaxFx" src="images/mountainsFr.png" /><img class="parallaxFx" src="images/ground.png" /></div>';
                $( newHtml ).insertAfter( ".clouds" );
                $('.twinkling').css('zIndex', '0');
            }

            $rootScope.cierraJuego = function () {
                $('#gameContent').empty();
                $('#particle-target').particleground(particles);
                var options = {
                    effectWeight: 1,
                    outerBuffer: 1.05,
                    elementDepth: 200,
                    perspectiveMulti: 1.5,
                    enableSmoothing: true
                };                
                $('#demo1').logosDistort(options);
            }

            $('#btnJuegoModal').click(function(event) {
                console.log('click!');
            });

        });

        // Una vez cargados todos los datos de la vista, desvanece el loading
        $rootScope.$on('$viewContentLoaded',
            function() {
              setTimeout(function(){ $("#loading").fadeOut("slow"); }, 1000);
            });
    });
