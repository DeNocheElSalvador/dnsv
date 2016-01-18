'use strict';

// Configuring the eventos module
angular.module('eventos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Eventos', 'eventos', 'dropdown', '/eventos(/create)?');
		Menus.addSubMenuItem('topbar', 'eventos', 'List eventos', 'eventos');
		Menus.addSubMenuItem('topbar', 'eventos', 'New Evento', 'eventos/create');
	}
]);