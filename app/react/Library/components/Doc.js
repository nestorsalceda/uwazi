import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import PrintDate from 'app/Layout/PrintDate';
import {selectDocument, unselectDocument} from '../actions/libraryActions';
import {TemplateLabel, Icon} from 'app/Layout';
import {formater} from 'app/Metadata';
import marked from 'marked';

import {RowList, ItemFooter, ItemName} from 'app/Layout/Lists';

export class Doc extends Component {

  select(active) {
    if (active) {
      return this.props.unselectDocument();
    }
    this.props.selectDocument(this.props.doc);
  }

  formatMetadata(populatedMetadata, creationDate) {
    let metadata = populatedMetadata
    .filter(p => p.showInCard && (p.value && p.value.length > 0 || p.markdown))
    .map((property, index) => {
      let value = typeof property.value !== 'object' ? property.value : property.value.map(d => d.value).join(', ');
      if (property.markdown) {
        value = <div className="markdownViewer" dangerouslySetInnerHTML={{__html: marked(property.markdown, {sanitize: true})}}/>;
      }
      return (
        <dl key={index}>
          <dt>{property.label}</dt>
          <dd><Icon className="item-icon item-icon-center" data={property.icon} size="xs"/>{value}</dd>
        </dl>
      );
    });

    let creationMetadata = <dl><dt><i>Upload date</i></dt><dd><PrintDate utc={creationDate} toLocal={true} /></dd></dl>;

    return metadata.length || populatedMetadata.filter(p => p.showInCard).length ? metadata : creationMetadata;
  }

  render() {
    let {title, _id, creationDate, template, icon} = this.props.doc;
    let documentViewUrl = `/${this.props.doc.type}/${_id}`;

    let active;
    if (this.props.selectedDocument) {
      active = this.props.selectedDocument === this.props.doc._id;
    }

    const className = this.props.doc.type === 'entity' ? 'item-entity' : 'item-document';

    const populatedMetadata = formater.prepareMetadata(this.props.doc, this.props.templates.toJS(), this.props.thesauris.toJS()).metadata;
    const metadata = this.formatMetadata(populatedMetadata, creationDate);

    return (
      <RowList.Item active={active} onClick={this.select.bind(this, active)} className={className}>
        <div className="item-info">
          <Icon className="item-icon item-icon-center" data={icon} size="xs"/>
          <ItemName>{title}</ItemName>
        </div>
        <div className="item-metadata">
          {metadata}
        </div>
        <ItemFooter>
          <TemplateLabel template={template}/>
          <Link to={documentViewUrl} className="item-shortcut">
            <span className="itemShortcut-arrow">
              <i className="fa fa-external-link"></i>
            </span>
          </Link>
        </ItemFooter>
      </RowList.Item>
    );
  }
}

Doc.propTypes = {
  doc: PropTypes.object,
  selectedDocument: PropTypes.string,
  selectDocument: PropTypes.func,
  unselectDocument: PropTypes.func,
  templates: PropTypes.object,
  thesauris: PropTypes.object
};


export function mapStateToProps(state) {
  return {
    selectedDocument: state.library.ui.get('selectedDocument') ? state.library.ui.get('selectedDocument').get('_id') : '',
    templates: state.templates,
    thesauris: state.thesauris
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({selectDocument, unselectDocument}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Doc);
