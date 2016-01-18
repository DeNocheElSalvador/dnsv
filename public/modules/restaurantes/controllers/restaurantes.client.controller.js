'use strict';

// Restaurantes controller
angular.module('restaurantes').controller('RestaurantesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Restaurantes',
	function($scope, $stateParams, $location, Authentication, Restaurantes) {
		$scope.authentication = Authentication;

		// Create new Restaurante
		$scope.create = function() {
			// Create new Restaurante object
			var restaurante = new Restaurantes ({
				name: this.name
			});

			// Redirect after save
			restaurante.$save(function(response) {
				$location.path('restaurantes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Restaurante
		$scope.remove = function(restaurante) {
			if ( restaurante ) { 
				restaurante.$remove();

				for (var i in $scope.restaurantes) {
					if ($scope.restaurantes [i] === restaurante) {
						$scope.restaurantes.splice(i, 1);
					}
				}
			} else {
				$scope.restaurante.$remove(function() {
					$location.path('restaurantes');
				});
			}
		};

		// Update existing Restaurante
		$scope.update = function() {
			var restaurante = $scope.restaurante;

			restaurante.$update(function() {
				$location.path('restaurantes/' + restaurante._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Restaurantes
		$scope.find = function() {
			$scope.restaurantes = Restaurantes.query();
		};

		// Find existing Restaurante
		$scope.findOne = function() {
			$scope.restaurante = Restaurantes.get({ 
				restauranteId: $stateParams.restauranteId
			});
		};
	}
]);