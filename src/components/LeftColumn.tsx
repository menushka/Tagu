import * as React from 'react';
import { Tabs, Tab, Button } from '@blueprintjs/core';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes } from '../store/types';
import { RootState } from '../store/store';

import { TagSearch } from './tagSearch';
import FileTree from './FileTree';
import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { TagsModel } from '../models/tagsModel';

type LeftColumnProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

type LeftColumnState = {};

class LeftColumn extends React.Component<LeftColumnProps, LeftColumnState> {
  constructor(props: LeftColumnProps) {
    super(props);

    this.onSelectedTagsChange = this.onSelectedTagsChange.bind(this);
    this.onSelectedImageChange = this.onSelectedImageChange.bind(this);

    this.state = {
      tags: TagsModel.instance.getTags(),
      selectedTags: [],
      selectedImage: undefined,
    };
  }

  onSelectedTagsChange(tags: Tag[]) {
    this.setState({ selectedTags: tags });
    // this.props.onTagsChange(tags);
  }

  onSelectedImageChange(image: Image | undefined) {
    this.setState({ selectedImage: image });
    // this.props.onImageChange(image);
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
                tags={this.props.searchTags}
                onChange={this.onSelectedTagsChange}/>
              <div className='flex-grow'>
                <FileTree />
              </div>
              <Button text='Export' icon='export' fill={true} onClick={this.onExport}/>
            </div>
          } />
          <Tab id='folders' title='By Tag' panelClassName='flex-grow flex-column' panel={
            <div className='flex-column flex-grow'>
              <div className='flex-grow'>
                <FileTree byTag/>
              </div>
              <Button text='Export' icon='export' fill={true} onClick={this.onExport}/>
            </div>
          } />
        </Tabs>
      </div>
    );
  }
}

const MapStateToProps = (store: RootState) => ({
  allTags: store.allTags,
  searchTags: store.search.selectedTags,
});

const MapDispatchToProps = (_dispatch: Dispatch<ActionTypes>) => ({});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(LeftColumn);
