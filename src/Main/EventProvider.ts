export enum EVENTS {
  CLICK = 'click',
  MOUSEMOVE = 'mousemove',
  KEYDOWN = 'keydown',
  KEYUP = 'keyup',
  KEY_W = 'key_w',
  KEY_A = 'key_a',
  KEY_S = 'key_s',
  KEY_D = 'key_d',
  UPDATE = 'update'
}

export class EventProvider {
  events: {[key in EVENTS]: ((...args: any) => void)[]} = {
    [EVENTS.CLICK]: [],
    [EVENTS.MOUSEMOVE]: [],
    [EVENTS.UPDATE]: [],
    [EVENTS.KEYDOWN]: [],
    [EVENTS.KEYUP]: [],
    [EVENTS.KEY_W]: [],
    [EVENTS.KEY_A]: [],
    [EVENTS.KEY_S]: [],
    [EVENTS.KEY_D]: []
  };

  on(eventName: EVENTS, cb: (...args: any) => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(cb)
  }

  off(eventName: EVENTS, cb: (...args: any) => void) {
    if (!this.events[eventName]) {
      return
    }
    this.events[eventName] = this.events[eventName].filter(el => el !== cb)
  }

  trigger(eventName: EVENTS, ...args: any) {
    if (!this.events[eventName]) {
      return
    }
    this.events[eventName].forEach(cb => cb(...args));
  }
}