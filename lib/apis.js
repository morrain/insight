"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMicroApps = registerMicroApps;
exports.loadMicroApp = loadMicroApp;
exports.start = start;
Object.defineProperty(exports, "getAppStatus", {
  enumerable: true,
  get: function get() {
    return _singleSpa.getAppStatus;
  }
});
exports.frameworkConfiguration = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _singleSpa = require("single-spa");

var _loader = require("./loader");

var _prefetch = require("./prefetch");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var microApps = []; // eslint-disable-next-line import/no-mutable-exports

var frameworkConfiguration = {};
exports.frameworkConfiguration = frameworkConfiguration;
var frameworkStartedDefer = new _utils.Deferred();

function registerMicroApps(apps, lifeCycles) {
  // Each app only needs to be registered once
  var unregisteredApps = apps.filter(function (app) {
    return !microApps.some(function (registeredApp) {
      return registeredApp.name === app.name;
    });
  });
  microApps = [].concat((0, _toConsumableArray2["default"])(microApps), (0, _toConsumableArray2["default"])(unregisteredApps));
  unregisteredApps.forEach(function (app) {
    var name = app.name,
        activeRule = app.activeRule,
        _app$loader = app.loader,
        loader = _app$loader === void 0 ? _utils.noop : _app$loader,
        props = app.props,
        appConfig = (0, _objectWithoutProperties2["default"])(app, ["name", "activeRule", "loader", "props"]);
    (0, _singleSpa.registerApplication)({
      name: name,
      app: function () {
        var _app = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
          var _yield$loadApp, mount, otherMicroAppConfigs;

          return _regenerator["default"].wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  loader(true);
                  _context3.next = 3;
                  return frameworkStartedDefer.promise;

                case 3:
                  _context3.next = 5;
                  return (0, _loader.loadApp)(_objectSpread({
                    name: name,
                    props: props
                  }, appConfig), frameworkConfiguration, lifeCycles);

                case 5:
                  _context3.t0 = _context3.sent;
                  _yield$loadApp = (0, _context3.t0)();
                  mount = _yield$loadApp.mount;
                  otherMicroAppConfigs = (0, _objectWithoutProperties2["default"])(_yield$loadApp, ["mount"]);
                  return _context3.abrupt("return", _objectSpread({
                    mount: [/*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                      return _regenerator["default"].wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              return _context.abrupt("return", loader(true));

                            case 1:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }))].concat((0, _toConsumableArray2["default"])((0, _utils.toArray)(mount)), [/*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                      return _regenerator["default"].wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              return _context2.abrupt("return", loader(false));

                            case 1:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }))])
                  }, otherMicroAppConfigs));

                case 10:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function app() {
          return _app.apply(this, arguments);
        }

        return app;
      }(),
      activeWhen: activeRule,
      customProps: props
    });
  });
}

var appConfigPromiseGetterMap = new Map();

function loadMicroApp(app, configuration, lifeCycles) {
  var props = app.props,
      name = app.name; // eslint-disable-next-line @typescript-eslint/no-invalid-void-type

  var getContainerXpath = function getContainerXpath(container) {
    var containerElement = (0, _utils.getContainer)(container);

    if (containerElement) {
      return (0, _utils.getXPathForElement)(containerElement, document);
    }

    return undefined;
  };

  var wrapParcelConfigForRemount = function wrapParcelConfigForRemount(config) {
    return _objectSpread(_objectSpread({}, config), {}, {
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      bootstrap: function bootstrap() {
        return Promise.resolve();
      }
    });
  };
  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */


  var memorizedLoadingFn = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var _ref4, $$cacheLifecycleByAppName, container, parcelConfigGetterPromise, xpath, _parcelConfigGetterPromise, parcelConfigObjectGetterPromise, _xpath;

      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _ref4 = configuration !== null && configuration !== void 0 ? configuration : frameworkConfiguration, $$cacheLifecycleByAppName = _ref4.$$cacheLifecycleByAppName;
              container = 'container' in app ? app.container : undefined;

              if (!container) {
                _context4.next = 22;
                break;
              }

              if (!$$cacheLifecycleByAppName) {
                _context4.next = 12;
                break;
              }

              parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);

              if (!parcelConfigGetterPromise) {
                _context4.next = 12;
                break;
              }

              _context4.t0 = wrapParcelConfigForRemount;
              _context4.next = 9;
              return parcelConfigGetterPromise;

            case 9:
              _context4.t1 = _context4.sent;
              _context4.t2 = (0, _context4.t1)(container);
              return _context4.abrupt("return", (0, _context4.t0)(_context4.t2));

            case 12:
              xpath = getContainerXpath(container);

              if (!xpath) {
                _context4.next = 22;
                break;
              }

              _parcelConfigGetterPromise = appConfigPromiseGetterMap.get("".concat(name, "-").concat(xpath));

              if (!_parcelConfigGetterPromise) {
                _context4.next = 22;
                break;
              }

              _context4.t3 = wrapParcelConfigForRemount;
              _context4.next = 19;
              return _parcelConfigGetterPromise;

            case 19:
              _context4.t4 = _context4.sent;
              _context4.t5 = (0, _context4.t4)(container);
              return _context4.abrupt("return", (0, _context4.t3)(_context4.t5));

            case 22:
              parcelConfigObjectGetterPromise = (0, _loader.loadApp)(app, configuration !== null && configuration !== void 0 ? configuration : frameworkConfiguration, lifeCycles);

              if (container) {
                if ($$cacheLifecycleByAppName) {
                  appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
                } else {
                  _xpath = getContainerXpath(container);
                  if (_xpath) appConfigPromiseGetterMap.set("".concat(name, "-").concat(_xpath), parcelConfigObjectGetterPromise);
                }
              }

              _context4.next = 26;
              return parcelConfigObjectGetterPromise;

            case 26:
              _context4.t6 = _context4.sent;
              return _context4.abrupt("return", (0, _context4.t6)(container));

            case 28:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function memorizedLoadingFn() {
      return _ref3.apply(this, arguments);
    };
  }();

  return (0, _singleSpa.mountRootParcel)(memorizedLoadingFn, _objectSpread({
    domElement: document.createElement('div')
  }, props));
}

function start() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  exports.frameworkConfiguration = frameworkConfiguration = _objectSpread({
    prefetch: true,
    singular: true,
    sandbox: true
  }, opts);
  var _frameworkConfigurati = frameworkConfiguration,
      prefetch = _frameworkConfigurati.prefetch,
      sandbox = _frameworkConfigurati.sandbox,
      singular = _frameworkConfigurati.singular,
      urlRerouteOnly = _frameworkConfigurati.urlRerouteOnly,
      importEntryOpts = (0, _objectWithoutProperties2["default"])(_frameworkConfigurati, ["prefetch", "sandbox", "singular", "urlRerouteOnly"]);

  if (prefetch) {
    (0, _prefetch.doPrefetchStrategy)(microApps, prefetch, importEntryOpts);
  }

  if (sandbox) {
    if (!window.Proxy) {
      console.warn('[insight] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
      frameworkConfiguration.sandbox = (0, _typeof2["default"])(sandbox) === 'object' ? _objectSpread(_objectSpread({}, sandbox), {}, {
        loose: true
      }) : {
        loose: true
      };

      if (!singular) {
        console.warn('[insight] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy');
      }
    }
  }

  (0, _singleSpa.start)({
    urlRerouteOnly: urlRerouteOnly
  });
  frameworkStartedDefer.resolve();
}