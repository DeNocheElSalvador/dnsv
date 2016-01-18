'use strict';

//Setting up route
angular.module('restaurantes').config(['$stateProvider',
	function($stateProvider) {
		// Restaurantes state routing
		$stateProvider.
		state('listRestaurantes', {
			url: '/restaurantes',
			templateUrl: 'modules/restaurantes/views/list-restaurantes.client.view.html'
		}).
		state('createRestaurante', {
			url: '/restaurantes/create',
			templateUrl: 'modules/restaurantes/views/create-restaurante.client.view.html'
		}).
		state('viewRestaurante', {
			url: '/restaurantes/:restauranteId',
			templateUrl: 'modules/restaurantes/views/view-restaurante.client.view.html'
		}).
		state('editRestaurante', {
			url: '/restaurantes/:restauranteId/edit',
			templateUrl: 'modules/restaurantes/views/edit-restaurante.client.view.html'
		});
	}
]);