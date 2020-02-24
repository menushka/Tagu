import * as React from 'react';
import Dropzone from 'react-dropzone';
import SplitPane from 'react-split-pane';

import { NonIdealState, Tabs, Tab } from '@blueprintjs/core';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { Media } from './Media';
import { NewFileDialog } from './NewFileDialog';
import { FileTree } from './FileTree';
import { TagSearch } from './TagSearch';
import { ImagesModel } from '../models/imagesModel';
import { TagsModel } from '../models/tagsModel';

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
            onFinish={() => this.setState({ fileDropped: null })} />
          <SplitPane minSize={250} >
            <div style={{height: '100vh'}}>
              <Tabs id='columnTabs'>
                <Tab id='search' title='Search' panel={
                  <div>
                    <TagSearch
                      tags={this.state.tags}
                      onChange={(tags) => this.setState({ selectedTags: tags })}/>
                    <FileTree
                      tags={this.state.selectedTags}
                      onSelect={path => this.setState({ selectedImage: path })}/>
                  </div>
                } />
                <Tab id='folders' title='By Tag' panel={
                  <FileTree
                    byTag={true}
                    onSelect={path => this.setState({ selectedImage: path })}/>
                } />
              </Tabs>
            </div>
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
