import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RowList, ItemFooter, ItemName} from 'app/Layout/Lists';
import {edit, finishEdit} from 'app/Uploads/actions/uploadsActions';
import {showModal} from 'app/Modals/actions/modalActions';
import {actions} from 'app/Metadata';
import {I18NLink} from 'app/I18N';

export class UploadDoc extends Component {
  showModal(modal, e) {
    if (modal) {
      e.stopPropagation();
      this.props.showModal(modal, this.props.doc);
    }
  }

  edit(doc, active) {
    if (active) {
      return this.props.finishEdit();
    }
    this.props.loadInReduxForm('uploads.metadata', doc, this.props.templates.toJS());
    this.props.edit(doc);
  }

  render() {
    let doc = this.props.doc.toJS();
    let modal = 'readyToPublish';

    let status = 'success';
    let message = 'Ready to publish';
    let progress = 0;


    let itsProcessing = doc.uploaded && typeof doc.processed === 'undefined';

    if (itsProcessing) {
      status = 'processing';
      message = 'Processing...';
      modal = '';
      progress = 100;
    }

    if (!doc.template && doc.processed) {
      status = 'warning';
      message = 'Metadata required';
      modal = '';
    }

    if (doc.uploaded && doc.processed === false) {
      status = 'danger';
      message = 'Conversion failed';
      modal = '';
    }

    if (doc.uploaded === false) {
      status = 'danger';
      message = 'Upload failed';
      modal = 'uploadFailed';
    }

    let itsUploading = typeof this.props.progress === 'number';

    if (itsUploading) {
      status = 'processing';
      modal = '';
      progress = this.props.progress;
    }

    let active;
    if (this.props.metadataBeingEdited) {
      active = this.props.metadataBeingEdited._id === doc._id;
    }

    return (
      <RowList.Item status={status} active={active} onClick={this.edit.bind(this, doc, active)}>
      <div className="item-info">
        <ItemName>{doc.title}</ItemName>
      </div>
      <ItemFooter onClick={this.showModal.bind(this, modal)}>
        {(() => {
          if (itsUploading || itsProcessing) {
            return <ItemFooter.ProgressBar progress={progress} />;
          } else {
            return <div className="item-actions">
              <span className="item-type item-type-0">
                <i className="item-type__icon fa fa-file-text-o"></i>
                <span className="item-type__name">Test Document</span>
              </span>
              <div className="item-shortcut-group">
                <I18NLink to={`/document/${doc.sharedId}`} className="btn btn-default" onClick={(e) => e.stopPropagation()}>
                  <span className="itemShortcut-arrow">
                    <i className="fa fa-external-link"></i>
                  </span>
                </I18NLink>
                <I18NLink to="#" className="btn btn-success">
                  <i className="fa fa-check"></i>
                </I18NLink>
                <I18NLink to="#" className="btn btn-warning">
                  <i className="fa fa-warning"></i>
                </I18NLink>
                <I18NLink to="#" className="btn btn-danger">
                  <i className="fa fa-trash"></i>
                </I18NLink>
              </div>
            </div>
          }
        })()}
      </ItemFooter>
    </RowList.Item>
    );
  }
}

UploadDoc.propTypes = {
  doc: PropTypes.object,
  progress: PropTypes.number,
  edit: PropTypes.func,
  metadataBeingEdited: PropTypes.object,
  loadInReduxForm: PropTypes.func,
  finishEdit: PropTypes.func,
  showModal: PropTypes.func,
  templates: PropTypes.object
};

export function mapStateToProps(state, props) {
  return {
    progress: state.uploads.progress.get(props.doc.get('_id')),
    metadataBeingEdited: state.uploads.uiState.get('metadataBeingEdited'),
    templates: state.uploads.templates
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({finishEdit, edit, loadInReduxForm: actions.loadInReduxForm, showModal}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadDoc);
