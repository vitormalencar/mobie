describe('mobie.core.component', function () {
	var $rootScope, $mbComponent, $animate;

	beforeEach(module('ngAnimateMock'));
	beforeEach(module('mobie.core.component'))

	beforeEach(inject(function (_$rootScope_, _$mbComponent_, _$animate_) {
		$rootScope = _$rootScope_
		$mbComponent = _$mbComponent_
		$animate = _$animate_
	}))

	describe('$mbComponent', function () {
		it('should remove component when scope is destroyed', function () {
			var scope = $rootScope.$new();
			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component1>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component1>';

			var modal = $mbComponent({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			assert.ok(modal.component.getElement());

			scope.$destroy();

			assert.equal(undefined, modal.component.getElement());
		})

		it('should recompile the component before show', function () {
			var scope = $rootScope.$new();

			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component>';

			var modal = $mbComponent({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			var mbComponentEl = angular.element(document.querySelector('mb-my-component'));

			var compiledTpl = 'that it, this is my modal template. and that is my value 1000';
			assert.equal(compiledTpl, mbComponentEl.text());

			scope.obj = {
				value: 1001
			};

			scope.$apply();

			assert.equal(compiledTpl.replace('1000', '1001'), mbComponentEl.text())
		});

		it('should emit an event when the element has entered in the dom', function () {
			var scope = $rootScope.$new();

			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component>';

			var modal = $mbComponent({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			var called = false;
			modal.component.on('enter', function () {
				called = true;
			});

			assert.equal(false, called);

			$rootScope.$digest();
			$animate.triggerCallbacks();

			assert.ok(called);
		});
	});

	describe('MbComponent', function () {
		var MbComponent;
		beforeEach(inject(function (_MbComponent_) {
			MbComponent = _MbComponent_;
			var el = angular.element('<div>')
			component = new MbComponent(el)
		}))

		it('should instantiate a new component', function () {
			assert.equal(MbComponent, component.constructor);
		})

		it('should set a component id', function () {
			var el = angular.element('<div>')
			var component = new MbComponent(el, 'my-component-id-here');
			assert.equal('my-component-id-here', component.id);
		})

		it('should emit an event when is visible', function () {
			component.on('visible', function () {
				this.fnCalled = true;
			})

			component.show()

			$rootScope.$digest()
			$animate.triggerCallbacks();

			assert.ok(component.fnCalled)
		})

		it('should emit an event when is not visible', function () {
			component.on('notVisible', function () {
				this.fnCalled = true;
			})
			
			component.hide()

			$rootScope.$digest()
			$animate.triggerCallbacks();

			assert.ok(component.fnCalled)
		})

		it('should return a promise', function (done) {
			var isVisible = false;
			var eventHasPassed = false;
			var el = angular.element('<my-component></my-component>');
			var component = new MbComponent(el)
			component.setId('my-component-id-here-3');
			component.on('visibleChangeStart', function () {
				eventHasPassed = true;
			})
			component.on('visible', function () {
				isVisible = true
			})
			component.show().then(function () {
				assert.ok(eventHasPassed);
				assert.ok(isVisible);
				done();
			});

			$rootScope.$digest()
			$animate.triggerCallbacks()
		});

		it('should not have an id key by default', function () {
			var component = new MbComponent();
			assert.ok('undefined', typeof component.getId())
		})

		it('should define a component id once', function () {
			var component = new MbComponent();
			component.setId('my-comp01');
			assert.equal('my-comp01', component.id);

			assert.throws(function () {
				component.setId('my-comp02')
			})
		})

		it('should enter the element', function () {
			var myel = angular.element('<div class="my-el"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el'));
			assert.throws(function () {
				assert.ok(_myel_.length)
			})

			component.enterElement();

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el'));

			assert.ok(myel.length)
		})

		it('should emit enter element events', function () {
			var myel = angular.element('<div class="my-el2"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el2'));
			assert.throws(function () {
				assert.ok(_myel_.length)
			})

			var enterElEvt = false,
					hasEntered = false;
			component.on('enterElementSuccess', function () {
				hasEntered = true;
			})
			component.on('enterElementStart', function () {
				enterElEvt = true;
			})

			component.enterElement();

			$animate.triggerCallbacks()

			myel = angular.element(document.querySelector('.my-el2'));

			assert.ok(myel.length)
			assert.ok(enterElEvt)
		})

		it('should leave the element', function () {
			var myel = angular.element('<div class="my-el3"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el3'));
			assert.throws(function () {
				assert.ok(_myel_.length)
			})

			component.enterElement();

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el3'));

			assert.ok(myel.length)

			component.leaveElement()

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el3'));

			assert.equal(null, myel[0]);
		})

		it('should emit leave element events', inject(function ($animate) {
			var myel = angular.element('<div class="my-el3"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el3'));
			assert.throws(function () {
				assert.ok(_myel_.length)
			})

			component.enterElement();

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el3'));

			assert.ok(myel.length)

			var leaveStartEvtCalled = false,
					leaveSuccessEvtCalled = false;
			component.on('leaveElementStart', function () {
				leaveStartEvtCalled = true;
			})
			component.on('leaveElementSuccess', function () {
				leaveSuccessEvtCalled = true
			})

			component.leaveElement();
			
			$animate.triggerCallbacks();

			myel = angular.element(document.querySelector('.my-el3'));

			assert.equal(null, myel[0]);

			assert.ok(leaveStartEvtCalled)
			assert.ok(leaveSuccessEvtCalled, '\'leaveElementSuccess\' event not called')
		}))
	})
})