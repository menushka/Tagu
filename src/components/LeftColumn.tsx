import * as React from 'react';
import { Tabs, Tab, Button } from '@blueprintjs/core';

import { remote } from 'electron';

import { connect } from 'react-redux';
import { SearchOrTag } from '../store/types';
import { RootState, AppDispatch } from '../store/store';

import TagSearch from './TagSearch';
import FileTree from './FileTree';
import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { switchColumn } from '../actions/actions';
import { FileTreeHelper } from '../helpers/fileTreeHelper';

type LeftColumnProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

class LeftColumn extends React.Component<LeftColumnProps, {}> {
  constructor(props: LeftColumnProps) {
    super(props);

    this.onSelectedTagsChange = this.onSelectedTagsChange.bind(this);
    this.onSelectedImageChange = this.onSelectedImageChange.bind(this);
  }

  onSelectedTagsChange(tags: Tag[]) {
    this.setState({ selectedTags: tags });
  }

  onSelectedImageChange(image: Image | undefined) {
    this.setState({ selectedImage: image });
  }

  onExport() {
    remote.dialog.showSaveDialog({
      title: 'Choose export directory...',
      properties: ['createDirectory', 'showOverwriteConfirmation'],
    }).then((response: Electron.SaveDialogReturnValue) => {
      if (response.canceled) { return; }

        FileTreeHelper.exportTreeToPath(this.props.currentFileTree, response.filePath!);
    });
  }

  render() {
    return (
      <div style={{height: '100vh'}}>
        <Tabs id='columnTabs' className='flex-column full-height' defaultSelectedTabId={this.props.columnId} onChange={this.props.onTabChange}>
          <Tab id='search' title='Search' panelClassName='flex-grow flex-column' panel={
            <div className='flex-column flex-grow'>
              <TagSearch />
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
  currentFileTree: store.leftColumnId === 'search' ? store.search.files : store.tag.files,
});

const MapDispatchToProps = (dispatch: AppDispatch) => ({
  onTabChange: (id: SearchOrTag) => dispatch(switchColumn(id)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(LeftColumn);
