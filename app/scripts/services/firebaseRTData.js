'use strict';

/**
 * @ngdoc service
 * @name drsimiApp.RTData
 * @description: request get genérico
 * # RTData
 * Factory in the drsimiApp.
 */
angular.module('drsimiApp')
    .factory('FirebaseRTData', [function() {

        return {
            checkLogInUser: function(fn) {
                return firebase.auth().onAuthStateChanged(fn);
            },
            logOut: function () {
            	return firebase.auth().signOut();
            },
            logIn: function (email, password) {
            	return firebase.auth().signInWithEmailAndPassword(email, password);
            },
            createUser: function (email, password) {
            	return firebase.auth().createUserWithEmailAndPassword(email, password);
            },
            ref: function (path) {
            	return firebase.database().ref(path);
            }
        };

    }]);
