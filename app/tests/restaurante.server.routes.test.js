'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Restaurante = mongoose.model('Restaurante'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, restaurante;

/**
 * Restaurante routes tests
 */
describe('Restaurante CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Restaurante
		user.save(function() {
			restaurante = {
				name: 'Restaurante Name'
			};

			done();
		});
	});

	it('should be able to save Restaurante instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Restaurante
				agent.post('/restaurantes')
					.send(restaurante)
					.expect(200)
					.end(function(restauranteSaveErr, restauranteSaveRes) {
						// Handle Restaurante save error
						if (restauranteSaveErr) done(restauranteSaveErr);

						// Get a list of Restaurantes
						agent.get('/restaurantes')
							.end(function(restaurantesGetErr, restaurantesGetRes) {
								// Handle Restaurante save error
								if (restaurantesGetErr) done(restaurantesGetErr);

								// Get Restaurantes list
								var restaurantes = restaurantesGetRes.body;

								// Set assertions
								(restaurantes[0].user._id).should.equal(userId);
								(restaurantes[0].name).should.match('Restaurante Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Restaurante instance if not logged in', function(done) {
		agent.post('/restaurantes')
			.send(restaurante)
			.expect(401)
			.end(function(restauranteSaveErr, restauranteSaveRes) {
				// Call the assertion callback
				done(restauranteSaveErr);
			});
	});

	it('should not be able to save Restaurante instance if no name is provided', function(done) {
		// Invalidate name field
		restaurante.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Restaurante
				agent.post('/restaurantes')
					.send(restaurante)
					.expect(400)
					.end(function(restauranteSaveErr, restauranteSaveRes) {
						// Set message assertion
						(restauranteSaveRes.body.message).should.match('Please fill Restaurante name');
						
						// Handle Restaurante save error
						done(restauranteSaveErr);
					});
			});
	});

	it('should be able to update Restaurante instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Restaurante
				agent.post('/restaurantes')
					.send(restaurante)
					.expect(200)
					.end(function(restauranteSaveErr, restauranteSaveRes) {
						// Handle Restaurante save error
						if (restauranteSaveErr) done(restauranteSaveErr);

						// Update Restaurante name
						restaurante.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Restaurante
						agent.put('/restaurantes/' + restauranteSaveRes.body._id)
							.send(restaurante)
							.expect(200)
							.end(function(restauranteUpdateErr, restauranteUpdateRes) {
								// Handle Restaurante update error
								if (restauranteUpdateErr) done(restauranteUpdateErr);

								// Set assertions
								(restauranteUpdateRes.body._id).should.equal(restauranteSaveRes.body._id);
								(restauranteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Restaurantes if not signed in', function(done) {
		// Create new Restaurante model instance
		var restauranteObj = new Restaurante(restaurante);

		// Save the Restaurante
		restauranteObj.save(function() {
			// Request Restaurantes
			request(app).get('/restaurantes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Restaurante if not signed in', function(done) {
		// Create new Restaurante model instance
		var restauranteObj = new Restaurante(restaurante);

		// Save the Restaurante
		restauranteObj.save(function() {
			request(app).get('/restaurantes/' + restauranteObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', restaurante.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Restaurante instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Restaurante
				agent.post('/restaurantes')
					.send(restaurante)
					.expect(200)
					.end(function(restauranteSaveErr, restauranteSaveRes) {
						// Handle Restaurante save error
						if (restauranteSaveErr) done(restauranteSaveErr);

						// Delete existing Restaurante
						agent.delete('/restaurantes/' + restauranteSaveRes.body._id)
							.send(restaurante)
							.expect(200)
							.end(function(restauranteDeleteErr, restauranteDeleteRes) {
								// Handle Restaurante error error
								if (restauranteDeleteErr) done(restauranteDeleteErr);

								// Set assertions
								(restauranteDeleteRes.body._id).should.equal(restauranteSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Restaurante instance if not signed in', function(done) {
		// Set Restaurante user 
		restaurante.user = user;

		// Create new Restaurante model instance
		var restauranteObj = new Restaurante(restaurante);

		// Save the Restaurante
		restauranteObj.save(function() {
			// Try deleting Restaurante
			request(app).delete('/restaurantes/' + restauranteObj._id)
			.expect(401)
			.end(function(restauranteDeleteErr, restauranteDeleteRes) {
				// Set message assertion
				(restauranteDeleteRes.body.message).should.match('User is not logged in');

				// Handle Restaurante error error
				done(restauranteDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Restaurante.remove().exec();
		done();
	});
});