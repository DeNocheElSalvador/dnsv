'use strict';

//Cars service used for communicating with the cars REST endpoints
angular.module('cars').factory('Cars', ['$resource',
	function($resource) {
		return $resource('cars/:carId', {
			carId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);