import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RowList, ItemFooter, ItemName} from 'app/Layout/Lists';
import {edit, finishEdit, publishEntity} from 'app/Uploads/actions/uploadsActions';
import {I18NLink} from 'app/I18N';
import {actions} from 'app/Metadata';

export class UploadEntity extends Component {
  publish(e) {
    e.stopPropagation();
    this.context.confirm({
      accept: () => {
        this.props.publishEntity(this.props.entity.toJS());
      },
      title: 'The entity is ready to be published: ',
      message: 'Publishing this entity will make it appear in public searches, are you sure?',
      type: 'success'
    });
  }

  edit(entity, active) {
    if (active) {
      return this.props.finishEdit();
    }

    this.props.loadInReduxForm('uploads.metadata', entity, this.props.templates.toJS());
    this.props.edit(entity);
  }

  render() {
    let entity = this.props.entity.toJS();
    let active;
    if (this.props.metadataBeingEdited) {
      active = this.props.metadataBeingEdited._id === entity._id;
    }

    return (
      <RowList.Item status="success" active={active} onClick={this.edit.bind(this, entity, active)}>
      <div className="item-info">
        <ItemName>{entity.title}</ItemName>
      </div>
      <ItemFooter onClick={this.publish.bind(this)}>
        <span className="item-type item-type-0">
          <i className="item-type__icon fa fa-bank"></i>
          <span className="item-type__name">Test Entity</span>
        </span>
        <div className="item-shortcut-group">
          <I18NLink to={`/entity/${entity.sharedId}`} className="btn btn-default" onClick={(e) => e.stopPropagation()}>
            <i className="fa fa-external-link"></i>
          </I18NLink>
          <I18NLink to="#" className="btn btn-success">
            <i className="fa fa-check"></i>
          </I18NLink>
        </div>
      </ItemFooter>
    </RowList.Item>
    );
  }
}

UploadEntity.propTypes = {
  entity: PropTypes.object,
  metadataBeingEdited: PropTypes.object,
  loadInReduxForm: PropTypes.func,
  finishEdit: PropTypes.func,
  templates: PropTypes.object,
  edit: PropTypes.func,
  publishEntity: PropTypes.func
};

UploadEntity.contextTypes = {
  confirm: PropTypes.func
};

export function mapStateToProps(state) {
  return {
    templates: state.uploads.templates,
    metadataBeingEdited: state.uploads.uiState.get('metadataBeingEdited')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({finishEdit, edit, loadInReduxForm: actions.loadInReduxForm, publishEntity}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadEntity);
