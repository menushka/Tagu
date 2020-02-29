import * as React from 'react';
import { Tabs, Tab, Button } from '@blueprintjs/core';

import { TagSearch } from './tagSearch';
import { FileTree } from './fileTree';
import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { TagsModel } from '../models/tagsModel';

type LeftColumnProps = { onTagsChange: (tags: Tag[]) => void, onImageChange: (image: Image | undefined) => void };

type LeftColumnState = {
  tags: Tag[],
  selectedTags: Tag[],
  selectedImage: Image | undefined,
};

export class LeftColumn extends React.Component<LeftColumnProps, LeftColumnState> {
  constructor(props: LeftColumnProps) {
    super(props);

    this.onSelectedTagsChange = this.onSelectedTagsChange.bind(this);
    this.onSelectedImageChange = this.onSelectedImageChange.bind(this);

    this.state = {
      tags: TagsModel.instance.getTags(),
      selectedTags: [],
      selectedImage: undefined
    };
  }

  onSelectedTagsChange(tags: Tag[]) {
    this.setState({ selectedTags: tags });
    this.props.onTagsChange(tags);
  }

  onSelectedImageChange(image: Image | undefined) {
    this.setState({ selectedImage: image });
    this.props.onImageChange(image);
  }

  onExport() {
    console.log('Export');
  }

  render() {
    return (
      <div style={{height: '100vh'}}>
        <Tabs id='columnTabs' className='flex-column full-height'>
          <Tab id='search' title='Search' panelClassName='flex-grow flex-column' panel={
            <div className='flex-column flex-grow'>
              <TagSearch
                tags={this.state.tags}
                onChange={this.onSelectedTagsChange}/>
              <div className='flex-grow'>
                <FileTree
                  tags={this.state.selectedTags}
                  onSelect={this.onSelectedImageChange}/>
              </div>
              <Button text='Export' icon='export' fill={true} onClick={this.onExport}/>
            </div>
          } />
          <Tab id='folders' title='By Tag' panelClassName='flex-grow flex-column' panel={
            <div className='flex-column flex-grow'>
              <div className='flex-grow'>
                <FileTree
                  byTag={true}
                  onSelect={this.onSelectedImageChange}/>
              </div>
              <Button text='Export' icon='export' fill={true} onClick={this.onExport}/>
            </div>
          } />
        </Tabs>
      </div>
    );
  }
}
