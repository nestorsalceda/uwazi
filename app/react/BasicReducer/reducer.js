import {fromJS as Immutable} from 'immutable';

const SET = 'SET';
const UNSET = 'UNSET';
const REMOVE = 'REMOVE';
const PUSH = 'PUSH';

export default function createReducer(namespace, defaultValue) {
  return (currentState = defaultValue, action = {}) => {
    switch (action.type) {
    case `${namespace}/${SET}`:
      return Immutable(action.value);

    case `${namespace}/${UNSET}`:
      return Immutable(defaultValue);

    case `${namespace}/${PUSH}`:
      return currentState.push(Immutable(action.value));

    case `${namespace}/${REMOVE}`:
      return Immutable(currentState).filter((object) => {
        return object.get('_id') !== action.value._id;
      });

    default:
      return Immutable(currentState);
    }
  };
}

export function set(namespace, value) {
  return {
    type: `${namespace}/${SET}`,
    value
  };
}

export function unset(namespace) {
  return {
    type: `${namespace}/${UNSET}`
  };
}

export function push(namespace, value) {
  return {
    type: `${namespace}/${PUSH}`,
    value
  };
}

export function remove(namespace, value) {
  return {
    type: `${namespace}/${REMOVE}`,
    value
  };
}
