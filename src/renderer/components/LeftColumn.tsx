import * as React from 'react';
import { Tabs, Tab, Button } from '@blueprintjs/core';

import { connect } from 'react-redux';
import { SearchOrTag } from '../store/types';
import { RootState, AppDispatch } from '../store/store';

import TagSearch from './TagSearch';
import FileTree from './FileTree';
import { Tag } from '../data/tag';
import { switchColumn, updateSearchTags } from '../actions/actions';
import { showOpenDialog } from '../electron/fileDialog';
import { FileTreeHelper } from '../helpers/fileTreeHelper';

import './LeftColumn.scss';

type LeftColumnProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

class LeftColumn extends React.Component<LeftColumnProps, {}> {
  onExport = () => {
    showOpenDialog(
      'Export',
      'Select directory to export current file selection into.  Tags will be converted to folders.',
      'Export',
    ).then((data) => {
      if (data?.length ?? 0 > 0) {
        FileTreeHelper.exportTreeToPath(this.props.currentFileTree, this.props.dataPath, data![0]);
      }
    });
  };

  render() {
    return (
      <div style={{height: '100vh'}}>
        <Tabs id='columnTabs' className='left-column' defaultSelectedTabId={this.props.columnId} onChange={this.props.onTabChange}>
          <Tab id='search' title='Search' panelClassName='left-column-tab' panel={
            <div className='left-column-tab-contents'>
              <TagSearch onChange={this.props.updateTags} />
              <FileTree />
              <Button text='Export' icon='export' fill={true} onClick={this.onExport}/>
            </div>
          } />
          <Tab id='tag' title='By Tag' panelClassName='left-column-tab' panel={
            <div className='left-column-tab-contents'>
              <FileTree byTag/>
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
  dataPath: store.preferences.dataPath,
});

const MapDispatchToProps = (dispatch: AppDispatch) => ({
  onTabChange: (id: SearchOrTag) => dispatch(switchColumn(id)),
  updateTags: (tags: Tag[]) => dispatch(updateSearchTags(tags)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(LeftColumn);
