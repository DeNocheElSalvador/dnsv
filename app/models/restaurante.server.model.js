'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Restaurante Schema
 */
var RestauranteSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Restaurante name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Restaurante', RestauranteSchema);