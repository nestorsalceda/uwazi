import Immutable from 'immutable';

import * as types from 'app/Templates/actions/actionTypes';

const initialState = {name: '', properties: []};

export default function fields(state = initialState, action = {}) {
  if (action.type === types.RESET_TEMPLATE) {
    return Immutable.fromJS(initialState);
  }

  if (action.type === types.SET_TEMPLATE) {
    return Immutable.fromJS(action.template);
  }

  if (action.type === types.ADD_PROPERTY) {
    return state.updateIn(['properties'], (properties) => properties.insert(action.index, Immutable.fromJS(action.config)));
  }

  if (action.type === types.UPDATE_PROPERTY) {
    return state.updateIn(['properties', action.index], (original) => original.merge(Immutable.fromJS(action.config)));
  }

  if (action.type === types.UPDATE_TEMPLATE) {
    return state.merge(Immutable.fromJS(action.template));
  }

  if (action.type === types.REMOVE_PROPERTY) {
    return state.deleteIn(['properties', action.index]);
  }

  if (action.type === types.REORDER_PROPERTY) {
    let originProperty = state.get('properties').get(action.originIndex);
    let targetProperty = state.get('properties').get(action.targetIndex);

    return state.setIn(['properties', action.targetIndex], originProperty)
    .setIn(['properties', action.originIndex], targetProperty);
  }

  return Immutable.fromJS(state);
}
