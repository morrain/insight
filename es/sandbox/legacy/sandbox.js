import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _typeof from "@babel/runtime/helpers/typeof";
import { SandBoxType } from '../../interfaces';
import { getTargetValue } from '../common';

function isPropConfigurable(target, prop) {
  var descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

function setWindowProp(prop, value, toDelete) {
  if (value === undefined && toDelete) {
    // eslint-disable-next-line
    delete window[prop];
  } else if (isPropConfigurable(window, prop) && _typeof(prop) !== 'symbol') {
    Object.defineProperty(window, prop, {
      writable: true,
      configurable: true
    });
    window[prop] = value;
  }
}
/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */


var SingularProxySandbox = /*#__PURE__*/function () {
  _createClass(SingularProxySandbox, [{
    key: "active",

    /** 沙箱期间新增的全局变量 */

    /** 沙箱期间更新的全局变量 */

    /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
    value: function active() {
      if (!this.sandboxRunning) {
        this.currentUpdatedPropsValueMap.forEach(function (v, p) {
          return setWindowProp(p, v);
        });
      }

      this.sandboxRunning = true;
    }
  }, {
    key: "inactive",
    value: function inactive() {
      if (process.env.NODE_ENV === 'development') {
        console.info("[insight:sandbox] ".concat(this.name, " modified global properties restore..."), [].concat(_toConsumableArray(this.addedPropsMapInSandbox.keys()), _toConsumableArray(this.modifiedPropsOriginalValueMapInSandbox.keys())));
      } // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
      // restore global props to initial snapshot


      this.modifiedPropsOriginalValueMapInSandbox.forEach(function (v, p) {
        return setWindowProp(p, v);
      });
      this.addedPropsMapInSandbox.forEach(function (_, p) {
        return setWindowProp(p, undefined, true);
      });
      this.sandboxRunning = false;
    }
  }]);

  function SingularProxySandbox(name) {
    _classCallCheck(this, SingularProxySandbox);

    _defineProperty(this, "addedPropsMapInSandbox", new Map());

    _defineProperty(this, "modifiedPropsOriginalValueMapInSandbox", new Map());

    _defineProperty(this, "currentUpdatedPropsValueMap", new Map());

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "proxy", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "sandboxRunning", true);

    this.name = name;
    this.type = SandBoxType.LegacyProxy;
    var addedPropsMapInSandbox = this.addedPropsMapInSandbox,
        modifiedPropsOriginalValueMapInSandbox = this.modifiedPropsOriginalValueMapInSandbox,
        currentUpdatedPropsValueMap = this.currentUpdatedPropsValueMap; // eslint-disable-next-line

    var self = this;
    var rawWindow = window;
    var fakeWindow = Object.create(null);
    var proxy = new Proxy(fakeWindow, {
      set: function set(_, p, value) {
        if (self.sandboxRunning) {
          if (!Object.prototype.hasOwnProperty.call(rawWindow, p)) {
            addedPropsMapInSandbox.set(p, value);
          } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
            // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
            var originalValue = rawWindow[p];
            modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
          }

          currentUpdatedPropsValueMap.set(p, value) // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          // eslint-disable-next-line no-param-reassign
          ;
          rawWindow[p] = value;
          return true;
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn("[insight] Set window.".concat(p.toString(), " while sandbox destroyed or inactive in ").concat(name, "!"));
        } // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误


        return true;
      },
      get: function get(_, p) {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'top' || p === 'parent' || p === 'window' || p === 'self') {
          return proxy;
        }

        var value = rawWindow[p];
        return getTargetValue(rawWindow, value);
      },
      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has: function has(_, p) {
        return p in rawWindow;
      }
    });
    this.proxy = proxy;
  }

  return SingularProxySandbox;
}();

export { SingularProxySandbox as default };