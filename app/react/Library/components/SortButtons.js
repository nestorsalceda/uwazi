import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from 'react-redux-form';
import {searchDocuments} from 'app/Library/actions/libraryActions';

export class SortButtons extends Component {
  sort(property) {
    let {search} = this.props;
    let order = search.order || 'desc';
    if (search.order === 'desc' && search.sort === property) {
      order = 'asc';
    }

    if (search.order === 'asc' && search.sort === property) {
      order = 'desc';
    }

    let sort = {sort: property, order: order};

    let filters = Object.assign({}, this.props.search, sort);
    this.props.merge('search', sort);
    this.props.searchDocuments(filters);
  }

  render() {
    let {search} = this.props;

    let order = 'down';
    if (search.order === 'asc') {
      order = 'up';
    }

    let sortingTitle = search.sort === 'title.raw';
    let sortingRecent = search.sort === 'creationDate';

    return (
      <div className="Dropdown u-floatRight">
        <span className="Dropdown-label">Sort by</span>
        <ul className="Dropdown-list">
          <li className="Dropdown-option">Item 1</li>
          <li className="Dropdown-option">Item 2</li>
          <li className="Dropdown-option">Item 3</li>
          <li className={'Dropdown-option' + (sortingTitle ? ' is-active' : '')} onClick={() => this.sort('title.raw')}>
            A-Z
            {sortingTitle ? <i className={'fa fa-caret-' + order}></i> : ''}
          </li>
          <li className={'Dropdown-option' + (sortingRecent ? ' is-active' : '')} onClick={() => this.sort('creationDate')}>
            Recent
            {sortingRecent ? <i className={'fa fa-caret-' + order}></i> : ''}
          </li>
        </ul>
      </div>
    );
  }
}

SortButtons.propTypes = {
  searchDocuments: PropTypes.func,
  merge: PropTypes.func,
  search: PropTypes.object
};

export function mapStateToProps({search}) {
  return {search};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({merge: actions.merge, searchDocuments}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SortButtons);
