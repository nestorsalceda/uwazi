// ENTIRE COMPONENT IS UNTESTED!!!!
// There is partial testing of added functionality, but this requires a full test.
import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {I18NLink} from 'app/I18N';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {formater, ShowMetadata} from 'app/Metadata';
import ShowIf from 'app/App/ShowIf';
import {NeedAuthorization} from 'app/Auth';
import {browserHistory} from 'react-router';
import {deleteEntity, addReference, deleteReference} from 'app/Entities/actions/actions';
import {CreateConnectionPanel} from 'app/Connections';
import {actions as connectionsActions} from 'app/Connections';
import EntityForm from '../containers/EntityForm';
import {MetadataFormButtons} from 'app/Metadata';
import {TemplateLabel, Icon} from 'app/Layout';

export class EntityViewer extends Component {

  deleteEntity() {
    this.context.confirm({
      accept: () => {
        this.props.deleteEntity(this.props.rawEntity.toJS())
        .then(() => {
          browserHistory.push('/');
        });
      },
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this entity?'
    });
  }

  // TESTED -----
  deleteReference(reference) {
    if (reference.sourceType !== 'metadata') {
      this.context.confirm({
        accept: () => {
          this.props.deleteReference(reference);
        },
        title: 'Confirm delete connection',
        message: 'Are you sure you want to delete this connection?'
      });
    }
  }

  conformGroupData(connectionType, groupedReferences, options) {
    let {key, connectionLabel, templateLabel} = options;
    let groupData = groupedReferences.find(ref => ref.key === key);

    if (!groupData) {
      groupData = {key, connectionType, connectionLabel, templateLabel, refs: []};
      groupedReferences.push(groupData);
    }

    return groupData;
  }

  getGroupData(reference, groupedReferences) {
    const referenceTemplate = this.props.templates
                              .find(t => t._id === reference.connectedDocumentTemplate);

    if (reference.sourceType === 'metadata') {
      return this.conformGroupData('metadata', groupedReferences, {
        key: reference.sourceProperty + '-' + reference.connectedDocumentTemplate,
        connectionLabel: referenceTemplate
                         .properties
                         .find(p => p.name === reference.sourceProperty)
                         .label,
        templateLabel: referenceTemplate.name
      });
    }

    if (reference.sourceType !== 'metadata') {
      return this.conformGroupData('connection', groupedReferences, {
        key: reference.relationType + '-' + reference.connectedDocumentTemplate,
        connectionLabel: this.props.relationTypes.find(r => r._id === reference.relationType).name,
        templateLabel: referenceTemplate ? referenceTemplate.name : 'documents without metadata'
      });
    }
  }

  groupReferences() {
    const references = this.props.references.toJS();

    const groupedReferences = [];
    references.forEach((reference) => {
      const groupData = this.getGroupData(reference, groupedReferences);
      groupData.refs.push(reference);
    });

    return groupedReferences;
  }

  render() {
    let {entity, entityBeingEdited, references} = this.props;
    references = references.toJS();

    const groupedReferences = this.groupReferences(references);
    const referencesHtml = groupedReferences.map((group) =>
      <div className="item-group" key={group.key}>
        <div className="item-group-header">
          <ShowIf if={group.connectionType === 'metadata'}>
            <div><b>{group.connectionLabel}</b> in <b>{group.templateLabel}</b> <span className="count">{group.refs.length}</span></div>
          </ShowIf>
          <ShowIf if={group.connectionType === 'connection'}>
            <div><b>{group.connectionLabel} {group.templateLabel}</b> <span className="count">{group.refs.length}</span></div>
          </ShowIf>
        </div>
        {group.refs.map((reference, index) => {
          return (
            <div key={index} className='item'>
              <div className="item-info">
                <div className="item-name">
                  <Icon className="item-icon item-icon-center" data={reference.connectedDocumentIcon} />
                  {reference.connectedDocumentTitle}
                  {(() => {
                    if (reference.text) {
                      return <div className="item-snippet">
                        {reference.text}
                      </div>;
                    }
                  })()}
                </div>
              </div>
              <div className="item-actions">
                <div className="item-label-group">
                  <TemplateLabel template={reference.connectedDocumentTemplate}/>
                  &nbsp;&nbsp;
                  <ShowIf if={!reference.connectedDocumentPublished}>
                    <span className="label label-warning">
                      <i className="fa fa-warning"></i> Unpublished
                    </span>
                  </ShowIf>
                </div>
                <div className="item-shortcut-group">
                  <NeedAuthorization>
                    <ShowIf if={reference.sourceType !== 'metadata'}>
                      <a className="item-shortcut" onClick={this.deleteReference.bind(this, reference)}>
                        <i className="fa fa-trash"></i>
                      </a>
                    </ShowIf>
                  </NeedAuthorization>
                  &nbsp;
                  <I18NLink
                    to={`/${reference.connectedDocumentType}/${reference.connectedDocument}`}
                    onClick={e => e.stopPropagation()}
                    className="item-shortcut">
                    <span className="itemShortcut-arrow">
                      <i className="fa fa-external-link"></i>
                    </span>
                  </I18NLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );

    return (
      <div className="row entity-content">
        <Helmet title={entity.title ? entity.title : 'Entity'} />
        <aside className="side-panel entity-metadata">
          <MetadataFormButtons
            delete={this.deleteEntity.bind(this)}
            data={this.props.rawEntity}
            formStatePath='entityView.entityForm'
            entityBeingEdited={entityBeingEdited}/>

          <div className="sidepanel-body">
            <ShowIf if={!entityBeingEdited}>
              <div className="item-info">
                <Icon className="item-icon item-icon-center" data={entity.icon} size="sm"/>
                <h1 className="item-name">{entity.title}</h1>
                <TemplateLabel template={entity.template}/>
              </div>
            </ShowIf>

            {(() => {
              if (entityBeingEdited) {
                return <EntityForm/>;
              }
              return <ShowMetadata entity={entity} showTitle={false} showType={false} />;
            })()}
          </div>
        </aside>
        <aside className="side-panel entity-connections">
          <div className="sidepanel-header">
            <ul className="nav nav-tabs">
              <li>
                <div className="tab-link tab-link-active">
                  <i className="fa fa-share-alt"></i>
                  <span className="connectionsNumber">{references.length}</span>
                </div>
              </li>
            </ul>
            &nbsp;
          </div>
          <NeedAuthorization>
            <div className="sidepanel-footer">
            <button onClick={this.props.startNewConnection.bind(null, 'basic', entity.sharedId)}
                    className="create-connection btn btn-success">
              <i className="fa fa-plus"></i>
              <span className="btn-label">New</span>
            </button>
            </div>
          </NeedAuthorization>
          <div className="sidepanel-body">
            {referencesHtml}
          </div>
        </aside>
        <CreateConnectionPanel containerId={entity.sharedId} onCreate={this.props.addReference}/>
      </div>
    );
  }
}

EntityViewer.propTypes = {
  entity: PropTypes.object,
  rawEntity: PropTypes.object,
  entityBeingEdited: PropTypes.bool,
  references: PropTypes.object,
  templates: PropTypes.array,
  relationTypes: PropTypes.array,
  deleteEntity: PropTypes.func,
  addReference: PropTypes.func,
  deleteReference: PropTypes.func,
  startNewConnection: PropTypes.func
};

EntityViewer.contextTypes = {
  confirm: PropTypes.func
};

const mapStateToProps = (state) => {
  let entity = state.entityView.entity.toJS();
  let templates = state.templates.toJS();
  let thesauris = state.thesauris.toJS();
  let relationTypes = state.relationTypes.toJS();

  let references = state.entityView.references
                   .filter(ref => !!state.user.get('_id') || ref.get('connectedDocumentPublished'));

  return {
    rawEntity: state.entityView.entity,
    templates,
    relationTypes,
    entity: formater.prepareMetadata(entity, templates, thesauris),
    references,
    entityBeingEdited: !!state.entityView.entityForm._id
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteEntity,
    addReference,
    deleteReference,
    startNewConnection: connectionsActions.startNewConnection
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityViewer);
