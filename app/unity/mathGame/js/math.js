$(document).ready(function() {

    Array.prototype.shuffled = function() {
        return this.map(function(n){
            return [Math.random(), n] 
        }).sort().map(function(n){
            return n[1]
        });
    }    

    var number1; // Primer número que se usará en la operación
    var operator; // Con este dato se obtiene el tipo de operación
    var number2; // Primer número que se usará en la operación
    var oculto; // Variable que tendrá el resultado que se espera de el usuario
    var myVar2;
    var score = 0;
    var errores = 0;
    var start = true;    

    // On click manda llamar las funciones que cargan los datos
    $('.btnGetMath').click(function(e) {

        clearInterval(myVar2);

        $('.btnGetMath').removeClass('bounceIn');

        setTimeout(function () {
            var valor = $(e.currentTarget).text();
            //console.log(valor, oculto);
            if(valor == oculto) {
                score++;
                $('.score').parent().addClass('animated wobble');
                $('.score').html(score);
                setTimeout(function () {
                    $('.score').parent().removeClass('animated wobble');
                }, 1000);
            } else {
                if(start == true) {
                    $('.errores').html(errores);
                    start = false;
                } else {
                    errores++;
                    $('.errores').parent().addClass('animated wobble');
                    $('.errores').html(errores);
                    if(errores >= 3) {
                        $('.gameOver').css('display', 'block').addClass('animated flipInY');

                        // Llama fn en angular para pasar el score
                        var scope = parent.angular.element(parent.document.getElementById("bs-example-navbar-collapse-1")).scope();
                        scope.$apply(function () {
                            scope.getScoreFromMathFrame(score);
                        });

                    }
                    setTimeout(function () {
                        $('.errores').parent().removeClass('animated wobble');
                    }, 1000);
                }
            }

            // Código que se usa para llamar el plugin que hace funcionar la progress bar
            $("#progressTimer").progressTimer({
                timeLimit: 4,
                warningThreshold: 5,
                baseStyle: 'progress-bar-info',
                warningStyle: 'progress-bar-warning',
                completeStyle: 'progress-bar-danger',
                onFinish: function() {                    
                    $('#segundos').html( 10 );
                }
            });

            // Llamada a resetCss() para resetear color de texto
            resetCss();     

            // Llamada a timerSecs() para presentar valor de progress bars
            timerSecs();

            // Llamada a getData() para empezar el proceso
            getData();            
        }, 500);
        
    });

    // On click reinicia juego
    $('#reinicia').click(function() {

        clearInterval(myVar2);

        $('.btnGetMath').removeClass('bounceIn');

        $('.gameOver').addClass('animated flipOutY');

        setTimeout(function () {
            $('.gameOver').removeClass('animated flipOutY');
            $('.gameOver').css('display', 'none');

            score = 0;
            errores = 0;

            $('.score').html(score);
            $('.errores').html(errores);

            // Código que se usa para llamar el plugin que hace funcionar la progress bar
            $("#progressTimer").progressTimer({
                timeLimit: 4,
                warningThreshold: 5,
                baseStyle: 'progress-bar-info',
                warningStyle: 'progress-bar-warning',
                completeStyle: 'progress-bar-danger',
                onFinish: function() {                    
                    $('#segundos').html( 10 );
                }
            });

            // Llamada a resetCss() para resetear color de texto
            resetCss();     

            // Llamada a timerSecs() para presentar valor de progress bars
            timerSecs();

            // Llamada a getData() para empezar el proceso
            getData();            
        }, 1000);

    });

    // Fn que obtiene de forma aleatoria los números que se usan para formular la operación
    function getData() {

        number1 = Math.floor((Math.random() * 10) + 1);
        operator = Math.floor((Math.random() * 4));
        number2 = Math.floor((Math.random() * 10) + 1);

        putMath();
    }

    // Fn que obtiene el string y realiza la operación para obtener el resultado final, de acuerdo a los datos que genera getData()
    function putMath() {

        var resultado; // Realiza la operación para generar el resultado

        // Switch que utiliza el valor aleatorio generado en operator para determinar el tipo de operación matemática que se realizará
        switch (operator) {
            case 0:
                resultado = number1 + number2;
                opType = '+';
                break;
            case 1:
                if(number2 > number1) {
                    var num1 = number1;
                    var num2 = number2;
                    number1 = num2;
                    number2 = num1;
                    resultado = number2 - number1;
                }
                resultado = number1 - number2;              
                opType = '-';
                break;
            case 2:
                resultado = number1 * number2;
                opType = 'x';
                break;
            case 3:
                getDivision();
                resultado = number1 / number2;
                opType = '÷';
                break;
        }

        // Se inyectan los datos en el Doom, excepto el que se pretende que conteste el usuario
        var incognita = Math.floor((Math.random() * 4) + 1);
        switch (incognita) {
            case 1:
                oculto = number1;
                number1 = '?';
                $('#operando1').css('color', 'white').addClass('badge');
                break;
            case 2:
                oculto = opType;
                opType = '?';
                $('#operacion').css('color', 'white').addClass('badge');
                break;
            case 3:
                oculto = number2;
                number2 = '?';
                $('#operando2').css('color', 'white').addClass('badge');
                break;
            case 4:
                oculto = resultado;
                resultado = '?';
                $('#resultado').css('color', 'white').addClass('badge');
                break;
        }

        $('#operando1').html(number1);
        $('#operacion').html(opType);
        $('#operando2').html(number2);
        $('#resultado').html(resultado);

        generaRespuestas();

        console.log('El usuario debe escoger: ' + oculto);
    }

    // Fn que se encarga de obtener una división con resultado cerrado, evitar resultados con decimales
    function getDivision() {

        // Se guardan los números que se habían conseguido de manera aleatoria
        var num1 = number1;
        var num2 = number2;

        // Se multiplican los números aleatorios para usar el resultado como primer operando de la división
        var multiplica = number1 * number2;

        // Se elige uno de los primeros números que se habían generado para usarse dentro de la nueva división
        var volado = Math.floor((Math.random() * 2) + 1);
        if (volado == 1) {
            number1 = multiplica;
            number2 = num1;
        } else {
            number1 = multiplica;
            number2 = num2;
        }
    }

    // Fn que obtiene el valor del contador con el porcentaje de la progress bar
    function timerSecs() {
	    myVar2 = setInterval(function() {
	    	var total = $('.progress').width();
	    	var actual = $('.progress-bar').width();
	    	var porcentaje = (actual * 100) / total;
	    	var pctFormat = (Math.round(porcentaje) / 10).toFixed(1);
	    	$('#segundos').html( pctFormat );
            if(porcentaje >= 99) {
                $('.gameOver').css('display', 'block').addClass('animated flipInY');
            }            
	    }, 100);      	
    }

    function resetCss() {
        $('#operando1').css('color', '#333').removeClass('badge');
        $('#operacion').css('color', '#333').removeClass('badge');
        $('#operando2').css('color', '#333').removeClass('badge');
        $('#resultado').css('color', '#333').removeClass('badge');
    }

    var resultadosR = [];

    function generaRespuestas() {
    	var sorteo = Math.floor((Math.random() * 4));
    	var respuestas = $('.btnGetMath');
        // Signos
        var signos = ['+', '-', 'x', '÷'];
        resultadosR = [];
    	if(oculto == '+' || oculto == '-' || oculto == 'x' || oculto == '÷') {
            signos = generaSignos(signos);
            for (var i = 0; i < respuestas.length; i++) {
                if(i === sorteo) {
                    $(respuestas[sorteo]).html(oculto).addClass('animated bounceIn');
                } else {
                    $(respuestas[i]).html(signos[0]).addClass('animated bounceIn');
                    signos.splice(0, 1);
                }
            }
    	} else {
            for (var i = 0; i < respuestas.length; i++) {
                if(i === sorteo) {
                    $(respuestas[sorteo]).html(oculto).addClass('animated bounceIn');
                } else {
                    var numSorteado = generaNum();
                    resultadosR.push(numSorteado);
                    $(respuestas[i]).html(numSorteado).addClass('animated bounceIn');
                }
            }
        }
    }

    function generaNum() {
        var nMin = (_.min([number1,number2]));
        var nMax = (_.max([number1,number2])) + 20;
        var numSorteado = randomIntFromInterval(nMin, nMax);
        if(numSorteado == oculto) {
            numSorteado += randomIntFromInterval(nMin, nMax);
        } else {
            for (var i = 0; i < resultadosR.length; i++) {
                if(resultadosR[i] == numSorteado) {
                    numSorteado += randomIntFromInterval(nMin, nMax);
                }
            }
        }
        return numSorteado;
    }

    function generaSignos(signos) {
        for (var i = 0; i < signos.length; i++) {
            if(signos[i] == oculto) {
                signos.splice(i, 1);
            }
        }
        return signos.shuffled();
    }

    function randomIntFromInterval(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    $('.circle').hover(function() {
        $(this).addClass('animated tada');
    }, function() {
        $(this).removeClass('animated tada');
    });

});
