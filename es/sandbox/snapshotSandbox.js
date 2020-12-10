import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { SandBoxType } from '../interfaces';

function iter(obj, callbackFn) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (var _prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, _prop)) {
      callbackFn(_prop);
    }
  }
}
/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */


var SnapshotSandbox = /*#__PURE__*/function () {
  function SnapshotSandbox(name) {
    _classCallCheck(this, SnapshotSandbox);

    _defineProperty(this, "proxy", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "sandboxRunning", true);

    _defineProperty(this, "windowSnapshot", void 0);

    _defineProperty(this, "modifyPropsMap", {});

    this.name = name;
    this.proxy = window;
    this.type = SandBoxType.Snapshot;
  }

  _createClass(SnapshotSandbox, [{
    key: "active",
    value: function active() {
      var _this = this;

      // 记录当前快照
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      this.windowSnapshot = {};
      iter(window, function (prop) {
        _this.windowSnapshot[prop] = window[prop];
      }); // 恢复之前的变更

      Object.keys(this.modifyPropsMap).forEach(function (p) {
        window[p] = _this.modifyPropsMap[p];
      });
      this.sandboxRunning = true;
    }
  }, {
    key: "inactive",
    value: function inactive() {
      var _this2 = this;

      this.modifyPropsMap = {};
      iter(window, function (prop) {
        if (window[prop] !== _this2.windowSnapshot[prop]) {
          // 记录变更，恢复环境
          _this2.modifyPropsMap[prop] = window[prop];
          window[prop] = _this2.windowSnapshot[prop];
        }
      });

      if (process.env.NODE_ENV === 'development') {
        console.info("[insight:sandbox] ".concat(this.name, " origin window restore..."), Object.keys(this.modifyPropsMap));
      }

      this.sandboxRunning = false;
    }
  }]);

  return SnapshotSandbox;
}();

export { SnapshotSandbox as default };