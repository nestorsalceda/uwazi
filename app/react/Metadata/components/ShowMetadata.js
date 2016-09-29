import React, {Component, PropTypes} from 'react';

import {Link} from 'react-router';
import ShowIf from 'app/App/ShowIf';
import marked from 'marked';
import {Icon} from 'app/Layout/Icon';
import {TemplateLabel} from 'app/Layout';

import TimelineViewer from 'app/Timeline/components/TimelineViewer';

export class ShowMetadata extends Component {
  getValue(property) {
    if (property.url) {
      return <Link to={property.url}>
               <Icon className="item-icon item-icon-center" data={property.icon} />
               {property.value}
             </Link>;
    }
    if (typeof property.value === 'object') {
      return <ul>
               {property.value.map((value, indx) => {
                 if (value.url) {
                   return <li key={indx}><Link to={value.url}>{value.value}</Link></li>;
                 }
                 return <li key={indx}>{value.value}</li>;
               })}
             </ul>;
    }

    if (property.markdown) {
      return <div className="markdownViewer" dangerouslySetInnerHTML={{__html: marked(property.markdown, {sanitize: true})}}/>;
    }

    return property.value;
  }

  render() {
    const {entity, showTitle, showType} = this.props;

    let header = '';
    if (showTitle || showType) {
      let title = '';
      if (showTitle) {
        title = <div>
                  <Icon className="item-icon item-icon-center" data={entity.icon} size="xs"/>
                  <h1 className="item-name">{entity.title}</h1>
                </div>;
      }
      const type = showType ? <TemplateLabel template={entity.template}/> : '';
      header = <div className="item-info">{title}{type}</div>;
    }

    return (
      <div className="view">
        {header}

        <ShowIf if={entity.template === 'cd951f1feec188a75916812d43252418' || entity.template === '6e2bfa14cc35c78b202a63e5c63ec969'}>
          <dl>
            <dd><TimelineViewer entity={entity} /></dd>
          </dl>
        </ShowIf>

        {entity.metadata.map((property, index) => {
          const value = this.getValue(property);
          return (
            <dl key={index}>
              <dt>{property.label}</dt>
              <dd>{value}</dd>
            </dl>
          );
        })}
      </div>
    );
  }
}

ShowMetadata.propTypes = {
  entity: PropTypes.object,
  showTitle: PropTypes.bool,
  showType: PropTypes.bool
};

export default ShowMetadata;
