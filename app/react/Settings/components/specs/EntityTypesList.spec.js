import React from 'react';
import {shallow} from 'enzyme';
import Immutable from 'immutable';

import {EntityTypesList} from '../EntityTypesList';

describe('EntityTypesList', () => {
  let component;
  let props;
  let context;

  beforeEach(() => {
    props = {
      templates: Immutable.fromJS([
        {_id: 1, name: 'Decision'},
        {_id: 2, name: 'Ruling'},
        {_id: 3, name: 'Judge', isEntity: true}
      ]),
      notify: jasmine.createSpy('notify'),
      deleteTemplate: jasmine.createSpy('deleteTemplate').and.returnValue(Promise.resolve()),
      checkTemplateCanBeDeleted: jasmine.createSpy('checkTemplateCanBeDeleted').and.returnValue(Promise.resolve())
    };

    context = {
      confirm: jasmine.createSpy('confirm')
    };
  });

  let render = () => {
    component = shallow(<EntityTypesList {...props} />, {context});
  };

  describe('render', () => {
    it('should render a list with only the entity templates, and exclude documents', () => {
      render();
      expect(component.find('ul.document-types').find('li').length).toBe(1);
    });
  });

  describe('when deleting a document type', () => {
    it('should check if can be deleted', (done) => {
      render();
      component.instance().deleteTemplate({_id: 3, name: 'Judge'})
      .then(() => {
        expect(props.checkTemplateCanBeDeleted).toHaveBeenCalled();
        done();
      });
    });

    it('should confirm the action', (done) => {
      render();
      component.instance().deleteTemplate({_id: 3, name: 'Judge'})
      .then(() => {
        expect(context.confirm).toHaveBeenCalled();
        done();
      });
    });
  });
});
