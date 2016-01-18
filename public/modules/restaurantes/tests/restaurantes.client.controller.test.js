'use strict';

(function() {
	// Restaurantes Controller Spec
	describe('Restaurantes Controller Tests', function() {
		// Initialize global variables
		var RestaurantesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Restaurantes controller.
			RestaurantesController = $controller('RestaurantesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Restaurante object fetched from XHR', inject(function(Restaurantes) {
			// Create sample Restaurante using the Restaurantes service
			var sampleRestaurante = new Restaurantes({
				name: 'New Restaurante'
			});

			// Create a sample Restaurantes array that includes the new Restaurante
			var sampleRestaurantes = [sampleRestaurante];

			// Set GET response
			$httpBackend.expectGET('restaurantes').respond(sampleRestaurantes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.restaurantes).toEqualData(sampleRestaurantes);
		}));

		it('$scope.findOne() should create an array with one Restaurante object fetched from XHR using a restauranteId URL parameter', inject(function(Restaurantes) {
			// Define a sample Restaurante object
			var sampleRestaurante = new Restaurantes({
				name: 'New Restaurante'
			});

			// Set the URL parameter
			$stateParams.restauranteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/restaurantes\/([0-9a-fA-F]{24})$/).respond(sampleRestaurante);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.restaurante).toEqualData(sampleRestaurante);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Restaurantes) {
			// Create a sample Restaurante object
			var sampleRestaurantePostData = new Restaurantes({
				name: 'New Restaurante'
			});

			// Create a sample Restaurante response
			var sampleRestauranteResponse = new Restaurantes({
				_id: '525cf20451979dea2c000001',
				name: 'New Restaurante'
			});

			// Fixture mock form input values
			scope.name = 'New Restaurante';

			// Set POST response
			$httpBackend.expectPOST('restaurantes', sampleRestaurantePostData).respond(sampleRestauranteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Restaurante was created
			expect($location.path()).toBe('/restaurantes/' + sampleRestauranteResponse._id);
		}));

		it('$scope.update() should update a valid Restaurante', inject(function(Restaurantes) {
			// Define a sample Restaurante put data
			var sampleRestaurantePutData = new Restaurantes({
				_id: '525cf20451979dea2c000001',
				name: 'New Restaurante'
			});

			// Mock Restaurante in scope
			scope.restaurante = sampleRestaurantePutData;

			// Set PUT response
			$httpBackend.expectPUT(/restaurantes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/restaurantes/' + sampleRestaurantePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid restauranteId and remove the Restaurante from the scope', inject(function(Restaurantes) {
			// Create new Restaurante object
			var sampleRestaurante = new Restaurantes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Restaurantes array and include the Restaurante
			scope.restaurantes = [sampleRestaurante];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/restaurantes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRestaurante);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.restaurantes.length).toBe(0);
		}));
	});
}());