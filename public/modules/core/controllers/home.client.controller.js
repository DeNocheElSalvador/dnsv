'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','cars',
	function($scope, Authentication, Cars) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


	}


]);