import * as types from 'app/Viewer/actions/actionTypes';

export function setDocument(document) {
  return {
    type: types.SET_DOCUMENT,
    document
  };
}