'use strict';

// Configuring the Articles module
angular.module('restaurantes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Restaurantes', 'restaurantes', 'dropdown', '/restaurantes(/create)?');
		Menus.addSubMenuItem('topbar', 'restaurantes', 'List Restaurantes', 'restaurantes');
		Menus.addSubMenuItem('topbar', 'restaurantes', 'New Restaurante', 'restaurantes/create');
	}
]);