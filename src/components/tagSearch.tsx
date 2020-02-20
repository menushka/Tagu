import * as React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';

import { Tag } from '../data/tag';

type TagSearchProps = { tags: Tag[], selectedTags: Tag[], onSelect: (tag: Tag) => void, onRemove: (index: number) => void };

type TagSearchState = {};

const TagMultiSelect = MultiSelect.ofType<Tag>();

export class TagSearch extends React.Component<TagSearchProps, TagSearchState> {
  render() {
    return (
      <TagMultiSelect
        fill={true}
        items={this.props.tags}
        itemPredicate={(query, tag) => !this.props.selectedTags.includes(tag) && tag.name.includes(query)}
        resetOnSelect={true}
        selectedItems={this.props.selectedTags}
        onItemSelect={this.props.onSelect}
        itemRenderer={(tag, { modifiers, handleClick }) => {
          return (
            <MenuItem
              active={modifiers.active}
              key={tag.name}
              label={tag.name}
              onClick={handleClick}
              shouldDismissPopover={false}
          />
        );
        }}
        tagRenderer={tag => tag.name}
        tagInputProps={{
          onRemove: (_value, index) => {
            this.props.onRemove(index);
          },
          placeholder: 'Search...',
          leftIcon: 'search'
        }}/>
    );
  }
}
