import {actions as formActions} from 'react-redux-form';

export function resetReduxForm(form) {
  return formActions.reset(form);
}

const resetMetadata = (metadata, template, options) => {
  template.properties.forEach((property) => {
    const assignProperty = options.resetExisting || !metadata[property.name];
    if (assignProperty && property.type !== 'date') {
      metadata[property.name] = '';
    }
    if (assignProperty && property.type === 'multiselect') {
      metadata[property.name] = [];
    }
    if (assignProperty && property.type === 'nested') {
      metadata[property.name] = [];
    }
    if (assignProperty && property.type === 'multidate') {
      metadata[property.name] = [];
    }
    if (assignProperty && property.type === 'multidaterange') {
      metadata[property.name] = [];
    }
  });
};

export function loadInReduxForm(form, onlyReadEntity, templates) {
  return function (dispatch) {
    //test
    let entity = Object.assign({}, onlyReadEntity);
    //

    if (!entity.template) {
      entity.template = templates[0]._id;
      if (entity.type === 'document' && templates.find(t => !t.isEntity)) {
        entity.template = templates.find(t => !t.isEntity)._id;
      }
      if (entity.type === 'entity' && templates.find(t => t.isEntity)) {
        entity.template = templates.find(t => t.isEntity)._id;
      }
    }

    if (!entity.metadata) {
      entity.metadata = {};
    }

    let template = templates.find((t) => t._id === entity.template);
    resetMetadata(entity.metadata, template, {resetExisting: false});

    dispatch(formActions.load(form, entity));
    dispatch(formActions.setInitial(form));
  };
}

export function changeTemplate(form, onlyReadEntity, template) {
  return function (dispatch) {
    //test
    let entity = Object.assign({}, onlyReadEntity);
    //

    entity.metadata = {};
    resetMetadata(entity.metadata, template, {resetExisting: true});
    entity.template = template._id;

    dispatch(formActions.reset(form));
    setTimeout(() => {
      dispatch(formActions.load(form, entity));
    });
  };
}
