'use strict';

//Eventos service used for communicating with the eventos REST endpoints
angular.module('eventos').factory('Eventos', ['$resource',
	function($resource) {
		return $resource('eventos/:eventoId', {
			eventoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);