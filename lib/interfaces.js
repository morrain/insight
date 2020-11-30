"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SandBoxType = void 0;
var SandBoxType;
exports.SandBoxType = SandBoxType;

(function (SandBoxType) {
  SandBoxType["Proxy"] = "Proxy";
  SandBoxType["Snapshot"] = "Snapshot"; // for legacy sandbox

  SandBoxType["LegacyProxy"] = "LegacyProxy";
})(SandBoxType || (exports.SandBoxType = SandBoxType = {}));