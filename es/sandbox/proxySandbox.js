import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/* eslint-disable no-param-reassign */
import { SandBoxType } from '../interfaces';
import { nextTick } from '../utils';
import { getTargetValue, setCurrentRunningSandboxProxy } from './common';
/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */

function uniq(array) {
  return array.filter(function filter(element) {
    return element in this ? false : this[element] = true;
  }, {});
} // zone.js will overwrite Object.defineProperty


var rawObjectDefineProperty = Object.defineProperty;
var variableWhiteListInDev = process.env.NODE_ENV === 'development' ? [// for react hot reload
// see https://github.com/facebook/create-react-app/blob/66bf7dfc43350249e2f09d138a20840dae8a0a4a/packages/react-error-overlay/src/index.js#L180
'__REACT_ERROR_OVERLAY_GLOBAL_HOOK__'] : []; // who could escape the sandbox

var variableWhiteList = [// FIXME System.js used a indirect call with eval, which would make it scope escape to global
// To make System.js works well, we write it back to global window temporary
// see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/evaluate.js#L106
'System', // see https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
'__cjsWrapper'].concat(variableWhiteListInDev);
/*
 variables who are impossible to be overwrite need to be escaped from proxy sandbox for performance reasons
 */

var unscopables = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true
};

function createFakeWindow(global) {
  // map always has the fastest performance in has check scenario
  // see https://jsperf.com/array-indexof-vs-set-has/23
  var propertiesWithGetter = new Map(); // eslint-disable-next-line @typescript-eslint/consistent-type-assertions

  var fakeWindow = {};
  /*
   copy the non-configurable property of global to fakeWindow
   see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
   > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
   */

  Object.getOwnPropertyNames(global).filter(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);
    return !(descriptor !== null && descriptor !== void 0 && descriptor.configurable);
  }).forEach(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);

    if (descriptor) {
      var hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');
      /*
       make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
       see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
       > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
       */

      if (p === 'top' || p === 'parent' || p === 'self' || p === 'window' || process.env.NODE_ENV === 'test' && (p === 'mockTop' || p === 'mockSafariTop')) {
        descriptor.configurable = true;
        /*
         The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
         Example:
          Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
          Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
         */

        if (!hasGetter) {
          descriptor.writable = true;
        }
      }

      if (hasGetter) propertiesWithGetter.set(p, true); // freeze the descriptor to avoid being modified by zone.js
      // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71

      rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
    }
  });
  return {
    fakeWindow: fakeWindow,
    propertiesWithGetter: propertiesWithGetter
  };
}

var activeSandboxCount = 0;
/**
 * 基于 Proxy 实现的沙箱
 */

var ProxySandbox = /*#__PURE__*/function () {
  _createClass(ProxySandbox, [{
    key: "active",

    /** window 值变更记录 */
    value: function active() {
      if (!this.sandboxRunning) activeSandboxCount++;
      this.sandboxRunning = true;
    }
  }, {
    key: "inactive",
    value: function inactive() {
      var _this = this;

      if (process.env.NODE_ENV === 'development') {
        console.info("[insight:sandbox] ".concat(this.name, " modified global properties restore..."), _toConsumableArray(this.updatedValueSet.keys()));
      }

      if (--activeSandboxCount === 0) {
        variableWhiteList.forEach(function (p) {
          if (Object.prototype.hasOwnProperty.call(_this.proxy, p)) {
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete window[p];
          }
        });
      }

      this.sandboxRunning = false;
    }
  }]);

  function ProxySandbox(name) {
    _classCallCheck(this, ProxySandbox);

    _defineProperty(this, "updatedValueSet", new Set());

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "proxy", void 0);

    _defineProperty(this, "sandboxRunning", true);

    this.name = name;
    this.type = SandBoxType.Proxy;
    var updatedValueSet = this.updatedValueSet; // eslint-disable-next-line @typescript-eslint/no-this-alias

    var self = this;
    var rawWindow = window;

    var _createFakeWindow = createFakeWindow(rawWindow),
        fakeWindow = _createFakeWindow.fakeWindow,
        propertiesWithGetter = _createFakeWindow.propertiesWithGetter;

    var descriptorTargetMap = new Map();

    var hasOwnProperty = function hasOwnProperty(key) {
      return Object.prototype.hasOwnProperty.call(fakeWindow, key) || Object.prototype.hasOwnProperty.call(rawWindow, key);
    };

    var proxy = new Proxy(fakeWindow, {
      set: function set(target, p, value) {
        if (self.sandboxRunning) {
          // @ts-expect-error
          target[p] = value;
          updatedValueSet.add(p);

          if (variableWhiteList.includes(p)) {
            // @ts-expect-error
            rawWindow[p] = value;
          }

          return true;
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn("[insight] Set window.".concat(p.toString(), " while sandbox destroyed or inactive in ").concat(name, "!"));
        } // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误


        return true;
      },
      get: function get(target, p) {
        if (p === Symbol.unscopables) return unscopables; // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13

        if (p === 'window' || p === 'self') {
          return proxy;
        }

        if (p === 'top' || p === 'parent' || process.env.NODE_ENV === 'test' && (p === 'mockTop' || p === 'mockSafariTop')) {
          // if your master app in an iframe context, allow these props escape the sandbox
          if (rawWindow === rawWindow.parent) {
            return proxy;
          }

          return rawWindow[p];
        } // proxy.hasOwnProperty would invoke getter firstly, then its value represented as rawWindow.hasOwnProperty


        if (p === 'hasOwnProperty') {
          return hasOwnProperty;
        } // mark the symbol to document while accessing as document.createElement could know is invoked by which sandbox for dynamic append patcher


        if (p === 'document' || p === 'eval') {
          setCurrentRunningSandboxProxy(proxy); // FIXME if you have any other good ideas
          // remove the mark in next tick, thus we can identify whether it in micro app or not
          // this approach is just a workaround, it could not cover all complex cases, such as the micro app runs in the same task context with master in some case

          nextTick(function () {
            return setCurrentRunningSandboxProxy(null);
          });

          switch (p) {
            case 'document':
              return document;

            case 'eval':
              // eslint-disable-next-line no-eval
              return eval;
            // no default
          }
        } // eslint-disable-next-line no-nested-ternary


        var value = propertiesWithGetter.has(p) ? rawWindow[p] : p in target ? target[p] : rawWindow[p];
        return getTargetValue(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has: function has(target, p) {
        return p in unscopables || p in target || p in rawWindow;
      },
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, p) {
        /*
         as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
         > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
         */
        if (Object.prototype.hasOwnProperty.call(target, p)) {
          var descriptor = Object.getOwnPropertyDescriptor(target, p);
          descriptorTargetMap.set(p, 'target');
          return descriptor;
        }

        if (Object.prototype.hasOwnProperty.call(rawWindow, p)) {
          var _descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);

          descriptorTargetMap.set(p, 'rawWindow'); // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object

          if (_descriptor && !_descriptor.configurable) {
            _descriptor.configurable = true;
          }

          return _descriptor;
        }

        return undefined;
      },
      // trap to support iterator with sandbox
      ownKeys: function ownKeys(target) {
        return uniq(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)));
      },
      defineProperty: function defineProperty(target, p, attributes) {
        var from = descriptorTargetMap.get(p);
        /*
         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
         otherwise it would cause a TypeError with illegal invocation.
         */

        switch (from) {
          case 'rawWindow':
            return Reflect.defineProperty(rawWindow, p, attributes);

          default:
            return Reflect.defineProperty(target, p, attributes);
        }
      },
      deleteProperty: function deleteProperty(target, p) {
        if (Object.prototype.hasOwnProperty.call(target, p)) {
          // @ts-expect-error
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete target[p];
          updatedValueSet["delete"](p);
          return true;
        }

        return true;
      }
    });
    this.proxy = proxy;
  }

  return ProxySandbox;
}();

export { ProxySandbox as default };