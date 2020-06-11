import * as React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';

import { Tag } from '../data/tag';
import { updateSearchTags, updateAddTags } from '../actions/actions';

type OwnProps = { create?: boolean };

type TagSearchProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

const TagMultiSelect = MultiSelect.ofType<Tag>();

class TagSearch extends React.Component<TagSearchProps, {}> {
  constructor(props: TagSearchProps) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onSelect(tag: Tag) {
    const currentTags = this.props.selectedTags.map(x => x);
    currentTags.push(tag);
    this.props.updateTags(currentTags);
  }

  onRemove(index: number) {
    const currentTags = this.props.selectedTags.map(x => x);
    currentTags.splice(index, 1);
    this.props.updateTags(currentTags);
  }

  render() {
    return (
      <TagMultiSelect
        fill={true}
        items={this.props.tags}
        itemPredicate={(query, tag) => !this.props.selectedTags.some(x => x.name === tag.name) && tag.name.includes(query)}
        resetOnSelect={true}
        selectedItems={this.props.selectedTags}
        onItemSelect={this.onSelect}
        itemRenderer={(tag, { modifiers, handleClick }) => {
          return (
            <MenuItem
              active={modifiers.active}
              key={tag.name}
              label={tag.name}
              onClick={handleClick}
              shouldDismissPopover={true}
          />
        );
        }}
        tagRenderer={tag => tag.name}
        tagInputProps={{
          onRemove: (_value, index) => {
            this.onRemove(index);
          },
          placeholder: 'Search...',
          leftIcon: 'search',
        }}
        noResults={<MenuItem disabled={true} text='No more tags.' />}
        createNewItemFromQuery={this.props.create ? (query) => { return new Tag(query); } : undefined}
        createNewItemRenderer={(query, active, handleClick) => {
          return (
            <MenuItem
              active={active}
              key={'create_new_tag'}
              icon='add'
              label={`Create new tag '${query}'`}
              onClick={handleClick}
              shouldDismissPopover={true}
          />
        );
        }}
        popoverProps={{
          modifiers: {
            arrow: { enabled: false},
          },
        }}/>
    );
  }
}

const MapStateToProps = (store: RootState, ownProps: OwnProps) => ({
  create: ownProps.create,
  tags: store.allTags,
  selectedTags: ownProps.create ? store.new.selectedTags : store.search.selectedTags,
});

const MapDispatchToProps = (dispatch: AppDispatch, ownProps: OwnProps) => ({
  updateTags: (tags: Tag[]) => dispatch(ownProps.create ? updateAddTags(tags) : updateSearchTags(tags)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(TagSearch);
