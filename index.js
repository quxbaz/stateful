/*
  stateful.js

  Base class for stateful objects
*/

import Sentry from 'sentry';

let assign = (...args) => Object.assign(...args);
let uniqId = 0;

export default class Stateful {

  constructor(state={}) {
    Object.defineProperty(this, 'state', {
      writable: false,
      value: assign(this.getInitialState(), state)
    });
    this.event = new Sentry();
  }

  getInitialState() {
    return {};
  }

  setState(state, silent=false) {

    /*
      If @silent is true, this function will not trigger a 'change'
      event on matter what.
    */

    let mergedState = assign({}, this.state, state);
    let validatedState = this.validateState(mergedState);

    let hasChanged = false;
    let keys = Object.keys(state);
    for (let i=0; i < keys.length; i++) {
      let key = keys[i];
      if (this.state[key] !== validatedState[key]) {
        hasChanged = true;
        break;
      }
    }

    if (hasChanged) {
      assign(this.state, validatedState);
      if (!silent)
        this.trigger('change', this.state);
    }

    return hasChanged;

  }

  validateState(nextState) {
    return nextState;
  }

  // Aliases
  on(...args) {return this.event.on(...args)}
  off(...args) {return this.event.off(...args)}
  trigger(...args) {return this.event.trigger(...args)}

}
