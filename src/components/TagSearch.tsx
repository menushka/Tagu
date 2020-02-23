import * as React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';

import { Tag } from '../data/tag';

type TagSearchProps = { tags: Tag[], onChange: (tags: Tag[]) => void, create?: boolean };

type TagSearchState = { tags: Tag[], selectedTags: Tag[], newTags: Tag[] };

const TagMultiSelect = MultiSelect.ofType<Tag>();

export class TagSearch extends React.Component<TagSearchProps, TagSearchState> {

  constructor(props: TagSearchProps) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);

    this.state = {
      tags: this.props.tags,
      selectedTags: [],
      newTags: []
    };
  }

  onSelect(tag: Tag) {
    const currentTags = this.state.selectedTags;
    currentTags.push(tag);
    this.setState({ selectedTags: currentTags });
    this.props.onChange(this.state.selectedTags);
  }

  onRemove(index: number) {
    const currentTags = this.state.selectedTags;
    const removedTag = currentTags[index];
    currentTags.splice(index, 1);
    this.setState({ selectedTags: currentTags });

    const currentNewTags = this.state.newTags;
    const newIndex = this.state.newTags.indexOf(removedTag);
    if (newIndex != -1) {
      currentNewTags.splice(newIndex, 1);
      this.setState({ newTags: currentNewTags });
    }

    this.props.onChange(currentTags.concat(currentNewTags));
  }

  onCreate(query: string) {
    return new Tag(query);
  }

  render() {
    return (
      <TagMultiSelect
        fill={true}
        items={this.props.tags}
        itemPredicate={(query, tag) => !this.state.selectedTags.includes(tag) && tag.name.includes(query)}
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
          leftIcon: 'search'
        }}
        noResults={<MenuItem disabled={true} text='No more tags.' />}
        createNewItemFromQuery={this.props.create ? this.onCreate : undefined}
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
            arrow: { enabled: false}
          }
        }}/>
    );
  }
}
