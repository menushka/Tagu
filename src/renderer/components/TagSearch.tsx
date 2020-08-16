import * as React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';

import { Tag } from '../data/tag';

type TagSearchState = {
  selectedTags: Tag[],
};

type TagSearchProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

const TagMultiSelect = MultiSelect.ofType<Tag>();

class TagSearch extends React.Component<TagSearchProps, TagSearchState> {
  constructor(props: TagSearchProps) {
    super(props);

    this.state = {
      selectedTags: this.props.initialTags ?? [],
    };
  }

  onSelect = (tag: Tag) => {
    if (tag.name.length <= 0) { return; }

    const tags = this.state.selectedTags;
    tags.push(tag);
    this.setState({ selectedTags: tags });
    this.props.onChange(tags);
  };

  onRemove = (index: number) => {
    const tags = this.state.selectedTags;
    tags.splice(index, 1);
    this.setState({ selectedTags: tags });
    this.props.onChange(tags);
  };

  render() {
    return (
      <TagMultiSelect
        fill={true}
        items={this.props.tags}
        itemPredicate={(query, tag) => !this.state.selectedTags.some(x => x.name === tag.name) && tag.name.includes(query)}
        resetOnSelect={true}
        selectedItems={this.state.selectedTags}
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

type OwnProps = {
  create?: boolean,
  initialTags?: Tag[];
  onChange: (tags: Tag[]) => void;
};

const MapStateToProps = (store: RootState, ownProps: OwnProps) => ({
  create: ownProps.create ?? false,
  initialTags: ownProps.initialTags,
  onChange: ownProps.onChange,
  tags: store.allTags,
});

const MapDispatchToProps = (_dispatch: AppDispatch) => ({});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(TagSearch);
