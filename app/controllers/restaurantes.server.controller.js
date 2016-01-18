'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Restaurante = mongoose.model('Restaurante'),
	_ = require('lodash');

/**
 * Create a Restaurante
 */
exports.create = function(req, res) {
	var restaurante = new Restaurante(req.body);
	restaurante.user = req.user;

	restaurante.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(restaurante);
		}
	});
};

/**
 * Show the current Restaurante
 */
exports.read = function(req, res) {
	res.jsonp(req.restaurante);
};

/**
 * Update a Restaurante
 */
exports.update = function(req, res) {
	var restaurante = req.restaurante ;

	restaurante = _.extend(restaurante , req.body);

	restaurante.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(restaurante);
		}
	});
};

/**
 * Delete an Restaurante
 */
exports.delete = function(req, res) {
	var restaurante = req.restaurante ;

	restaurante.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(restaurante);
		}
	});
};

/**
 * List of Restaurantes
 */
exports.list = function(req, res) { 
	Restaurante.find().sort('-created').populate('user', 'displayName').exec(function(err, restaurantes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(restaurantes);
		}
	});
};

/**
 * Restaurante middleware
 */
exports.restauranteByID = function(req, res, next, id) { 
	Restaurante.findById(id).populate('user', 'displayName').exec(function(err, restaurante) {
		if (err) return next(err);
		if (! restaurante) return next(new Error('Failed to load Restaurante ' + id));
		req.restaurante = restaurante ;
		next();
	});
};

/**
 * Restaurante authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.restaurante.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
