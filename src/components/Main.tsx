import * as React from 'react';
import Dropzone from 'react-dropzone';
import SplitPane from 'react-split-pane';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { onDropFile, readPreferencesFile } from '../actions/actions';

import Media from './Media';
import NewFileDialog from './dialogs/NewFileDialog';
import PreferencesDialog from './dialogs/PreferencesDialog';
import LeftColumn from './LeftColumn';
import EditTagDialog from './dialogs/EditTagDialog';

type MainProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

class Main extends React.Component<MainProps, {}> {
  constructor(props: MainProps) {
    super(props);

    this.props.readPreferences();
  }

  render() {
    return (
      <Dropzone onDrop={this.props.onFileDrop} noClick noKeyboard multiple={false}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          <NewFileDialog />
          <EditTagDialog />
          <PreferencesDialog />
          <SplitPane minSize={250} maxSize={-250}>
            <LeftColumn />
            <div style={{height: '100vh'}}>
              <Media />
            </div>
          </SplitPane>
          </div>
        )}
      </Dropzone>
    );
  }
}

const MapStateToProps = (_store: RootState) => ({});

const MapDispatchToProps = (dispatch: AppDispatch) => ({
  readPreferences: () => dispatch(readPreferencesFile()),
  onFileDrop: (acceptedFiles: File[]) => dispatch(onDropFile(acceptedFiles[0].path)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(Main);
