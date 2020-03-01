import * as React from 'react';
import { Tabs, Tab, Button } from '@blueprintjs/core';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes, SearchOrTag } from '../store/types';
import { RootState } from '../store/store';

import { TagSearch } from './TagSearch';
import FileTree from './FileTree';
import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { switchColumn } from '../actions/actions';

type LeftColumnProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

class LeftColumn extends React.Component<LeftColumnProps, {}> {
  constructor(props: LeftColumnProps) {
    super(props);

    this.onSelectedTagsChange = this.onSelectedTagsChange.bind(this);
    this.onSelectedImageChange = this.onSelectedImageChange.bind(this);
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
        <Tabs id='columnTabs' className='flex-column full-height' defaultSelectedTabId={this.props.columnId} onChange={this.props.onTabChange}>
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
          <Tab id='tag' title='By Tag' panelClassName='flex-grow flex-column' panel={
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
  columnId: store.leftColumnId,
  allTags: store.allTags,
  searchTags: store.search.selectedTags,
});

const MapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({
  onTabChange: (id: SearchOrTag) => dispatch(switchColumn(id)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(LeftColumn);
