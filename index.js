/*
  stateful.js

  Base class for stateful objects
*/

import Sentry from 'sentry';

let assign = (...args) => Object.assign(...args);
let uniqId = 0;

export class Stateful {

  constructor(state={}) {
    this.id = uniqId++;
    Object.defineProperty(this, 'state', {
      writable: false,
      value: assign({}, state)
    });
    this.event = new Sentry();
  }

  setState(state) {
    let nextState = assign({}, this.state, state);
    assign(this.state, this.validateState(nextState));
    this.event.trigger('change', this.state);
  }

  validateState(nextState) {
    return nextState;
  }

  // Aliases
  on(...args) {return this.event.on(...args)}
  off(...args) {return this.event.off(...args)}
  trigger(...args) {return this.event.trigger(...args)}

}