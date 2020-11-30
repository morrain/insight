import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

/* eslint-disable no-param-reassign */
import { noop } from '../../utils';
var rawAddEventListener = window.addEventListener;
var rawRemoveEventListener = window.removeEventListener;
export default function patch(global) {
  var listenerMap = new Map();

  global.addEventListener = function (type, listener, options) {
    var _listenerMap$get;

    var listeners = (_listenerMap$get = listenerMap.get(type)) !== null && _listenerMap$get !== void 0 ? _listenerMap$get : [];
    listenerMap.set(type, [].concat(_toConsumableArray(listeners), [listener]));
    return rawAddEventListener.call(window, type, listener, options);
  };

  global.removeEventListener = function (type, listener, options) {
    var storedTypeListeners = listenerMap.get(type); // eslint-disable-next-line

    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.includes(listener)) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }

    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach(function (listeners, type) {
      return _toConsumableArray(listeners).forEach(function (listener) {
        return global.removeEventListener(type, listener);
      });
    });
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;
    return noop;
  };
}