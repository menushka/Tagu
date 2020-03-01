import * as React from 'react';
import Dropzone from 'react-dropzone';
import SplitPane from 'react-split-pane';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes } from '../store/types';
import { RootState } from '../store/store';
import { onDropFile } from '../actions/actions';

import { NonIdealState } from '@blueprintjs/core';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { Media } from './Media';
import NewFileDialog from './NewFileDialog';
import { TagsModel } from '../models/tagsModel';
import LeftColumn from './LeftColumn';

type MainProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

type MainState = {
  tags: Tag[],
  selectedTags: Tag[],
  selectedImage: Image | undefined,
};

class Main extends React.Component<MainProps, MainState> {

  constructor(props: MainProps) {
    super(props);

    this.state = {
      tags: TagsModel.instance.getTags(),
      selectedTags: [],
      selectedImage: undefined,
    };
  }

  render() {
    return (
      <Dropzone onDrop={this.props.onFileDrop} noClick noKeyboard multiple={false}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          <NewFileDialog />
          <SplitPane minSize={250} >
            <LeftColumn />
            <div style={{height: '100vh'}}>
              { this.state.selectedImage ? (
                <Media image={this.state.selectedImage} />
              ) : (
                <NonIdealState
                  icon={'help'}
                  title='Nothing selected'
                  description={'No displayable item is selected in the left column.'} />
              )}
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
  onFileDrop: (acceptedFiles: File[]) => dispatch(onDropFile(acceptedFiles[0].path)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(Main);
