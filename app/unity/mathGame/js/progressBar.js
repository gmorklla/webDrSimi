$(document).ready(function() {

	var intervalo = ($('.progress').width() * 10) / 10;
	var cantidad = ($('.progress').width() * 10) / 100;
    var valeur = cantidad;
    var second = 0;

    $('.progress-bar').css('width', valeur + 'px').attr('aria-valuenow', valeur);

    var myVar = setInterval(function() { 
    	myTimer() 
    }, 1000);

    function myTimer() {
        valeur += cantidad;
        $('.progress-bar').css('width', valeur + 'px').attr('aria-valuenow', valeur);
        second++;
        if(second == 11) {
        	clearInterval(myVar);
        	return;
        }
        $('#segundos').html( second );
        console.log(second);
    }

    function reiniciaTimer() {
    	$('.progress-bar').css('width', 0 + 'px').attr('aria-valuenow', 0);
    	second = 0;
    	myVar;
    }

});
