"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SandBoxType = void 0;
// just for manual loaded apps, in single-spa it called parcel
// for the route-based apps
var SandBoxType;
exports.SandBoxType = SandBoxType;

(function (SandBoxType) {
  SandBoxType["Proxy"] = "Proxy";
  SandBoxType["Snapshot"] = "Snapshot";
  SandBoxType["LegacyProxy"] = "LegacyProxy";
})(SandBoxType || (exports.SandBoxType = SandBoxType = {}));