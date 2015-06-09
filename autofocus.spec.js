(function() {
    'use strict';
    describe('Directive: autofocus [A]', function() {
        var $scope,
            $compile,
            $timeout,
            $document,
            tpl = '<input type="text" autofocus="{{watchProperty}}" autofocus-delay="{{delay}}" />',
            $element,
            nativeSupport;

        beforeEach(module('autofocus'));

        beforeEach(function() {
            jasmine.addMatchers({
                toHaveFocus: function() {
                    return {
                        compare: function($element) {
                            var dom = $element[0],
                                focused = dom == document.activeElement;
                            return {
                                pass: focused,
                                message: focused ? 'Expected ' + dom + ' not to have focus'
                                    : 'Expected ' + dom + ' to have focus'
                            };
                        }
                    };
                },
                toHaveBeenFocused: function() {
                    return {
                        compare: function($element) {
                            var dom = $element[0],
                                focused = dom.focus.calls.any();
                            return {
                                pass: focused,
                                message: focused ? 'Expected ' + dom + ' not to have been focused programatically'
                                    : 'Expected ' + dom + ' to have been focused programatically'
                            };
                        }
                    }
                }
            });
        });

        beforeEach(inject(function($rootScope, _$compile_, _$timeout_, _$document_) {
            var elementFn = angular.element;
            $scope = $rootScope.$new();
            $compile = _$compile_;
            $timeout = _$timeout_;
            $document = _$document_;

            nativeSupport = false;
            spyOn(angular, 'element').and.callFake(function() {
                var $element = {
                    0: {}
                };
                if (nativeSupport) {
                    $element = elementFn.apply(angular, arguments);
                }
                angular.element = elementFn;
                return $element;
            })
        }));

        afterEach(function() {
            $element.remove();
        });

        function compile() {
            $element = $compile(tpl)($scope);
            spyOn($element[0], 'focus').and.callThrough();
            angular.element($document[0].body).append($element);
        }

        function flush() {
            $timeout.flush(($scope.delay || 0) - 1);
            expect($element).not.toHaveBeenFocused();
            expect($element).not.toHaveFocus();
            $timeout.flush(1);
        }

        describe('<input autofocus>', function() {
            it('should have focus immediately', onLinkTest);
        });

        describe('<input autofocus> with browser-native implementation of autofocus', function() {
            it('should not explicitly make a call to dom.focus()', function() {
                nativeSupport = true;
                compile();
                flush();
                expect($element).not.toHaveBeenFocused();
            });
        });

        describe('<input autofocus autofocus-delay="500">', function() {
            it('should have focus after 500ms', function() {
                $scope.delay = 500;
                onLinkTest();
            });
        });

        function onLinkTest() {
            compile();
            flush();
            expect($element).toHaveBeenFocused();
            expect($element).toHaveFocus();
        }

        describe('<input autofocus="watchProperty">', function() {
            beforeEach(watchBeforeEach);
            it('should not have focus immediately when $scope.watchProperty is falsy', falsyWatchTest);
            it('should have focus immediately when $scope.watchProperty is truthy', truthyWatchTest);
        });

        describe('<input autofocus="watchProperty" autofocus-delay="500">', function() {
            beforeEach(function() {
                $scope.delay = 500;
                watchBeforeEach();
            });
            it('should not have focus after 500ms when $scope.autofocus is falsy', falsyWatchTest);
            it('should have focus after 500ms when $scope.autofocus is truthy', truthyWatchTest);
        });

        function watchBeforeEach() {
            $scope.watchProperty = 'autofocus';
            $scope.autofocus = false;
            compile();
        }

        function falsyWatchTest() {
            $timeout.verifyNoPendingTasks();
            expect($element).not.toHaveBeenFocused();
            expect($element).not.toHaveFocus();
        }

        function truthyWatchTest() {
            falsyWatchTest();
            $scope.autofocus = true;
            $scope.$digest();
            flush();
            expect($element).toHaveBeenFocused();
            expect($element).toHaveFocus();
        }
    });
})();
