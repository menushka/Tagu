import * as React from 'react';
import Dropzone from 'react-dropzone';
import SplitPane from 'react-split-pane';

import { NonIdealState } from '@blueprintjs/core';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { Media } from './Media';
import { NewFileDialog } from './NewFileDialog';
import { ImagesModel } from '../models/imagesModel';
import { TagsModel } from '../models/tagsModel';
import { LeftColumn } from './LeftColumn';

type MainProps = {};

type MainState = {
  tags: Tag[],
  selectedTags: Tag[],
  selectedImage: Image | undefined,
  fileDropped: string | null
};

export class Main extends React.Component<MainProps, MainState> {

  constructor(props: MainProps) {
    super(props);

    ImagesModel.instance.initalize();
    TagsModel.instance.initalize();

    this.onFileDrop = this.onFileDrop.bind(this);

    this.state = {
      tags: TagsModel.instance.getTags(),
      selectedTags: [],
      selectedImage: undefined,
      fileDropped: null
    };
  }

  onFileDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    this.setState({ fileDropped: file.path });
  }

  render() {
    return (
      <Dropzone onDrop={this.onFileDrop} noClick noKeyboard multiple={false}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          <NewFileDialog
            newFilePath={this.state.fileDropped}
            onClose={() => this.setState({ fileDropped: null })}
            onFinish={() => this.setState({ fileDropped: null })} />
          <SplitPane minSize={250} >
            <LeftColumn
              onTagsChange={tags => this.setState({ selectedTags: tags })}
              onImageChange={image => this.setState({ selectedImage: image })} />
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
