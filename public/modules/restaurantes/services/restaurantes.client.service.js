'use strict';

//Restaurantes service used to communicate Restaurantes REST endpoints
angular.module('restaurantes').factory('Restaurantes', ['$resource',
	function($resource) {
		return $resource('restaurantes/:restauranteId', { restauranteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);