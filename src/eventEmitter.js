//参考https://www.jianshu.com/p/fb915d9c99c4 和 https://github.com/zhuwenqi001/blockMap/blob/master/src/eventEmitter.js
class EventEmitter {
  _event = {}

  on(eventName, handle) {
    let listeners = this._event[eventName];
    if (!listeners || !listeners.length) {
      this._event[eventName] = [handle];
      return;
    }
    listeners.push(handle);
  }
  
  emit(eventName, ...args) {
    const listeners = this._event[eventName]; 
    if (listeners && listeners.length) { 
      for (const l of listeners) { 
        l(...args);
      }
    }
  }
}
const event = new EventEmitter();
export {
  event
};