'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var restaurantes = require('../../app/controllers/restaurantes.server.controller');

	// Restaurantes Routes
	app.route('/restaurantes')
		.get(restaurantes.list)
		.post(users.requiresLogin, restaurantes.create);

	app.route('/restaurantes/:restauranteId')
		.get(restaurantes.read)
		.put(users.requiresLogin, restaurantes.hasAuthorization, restaurantes.update)
		.delete(users.requiresLogin, restaurantes.hasAuthorization, restaurantes.delete);

	// Finish by binding the Restaurante middleware
	app.param('restauranteId', restaurantes.restauranteByID);
};
