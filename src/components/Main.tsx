import * as React from 'react';
import Dropzone from 'react-dropzone';
import SplitPane from 'react-split-pane';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes } from '../store/types';
import { RootState } from '../store/store';
import { onDropFile, readPreferencesFile } from '../actions/actions';

import Media from './Media';
import NewFileDialog from './NewFileDialog';
import PreferencesDialog from './PreferencesDialog';
import LeftColumn from './LeftColumn';

type MainProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

class Main extends React.Component<MainProps, {}> {
  constructor(props: MainProps) {
    super(props);

    this.props.initialize();
  }

  render() {
    return (
      <Dropzone onDrop={this.props.onFileDrop} noClick noKeyboard multiple={false}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          <NewFileDialog />
          <PreferencesDialog />
          <SplitPane minSize={250} >
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

const MapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({
  initialize: () => dispatch(readPreferencesFile()),
  onFileDrop: (acceptedFiles: File[]) => dispatch(onDropFile(acceptedFiles[0].path)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(Main);
