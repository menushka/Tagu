import * as React from 'react';
import * as path from 'path';
import Dropzone from 'react-dropzone';
import SplitPane from 'react-split-pane';

import { ITreeNode, NonIdealState } from '@blueprintjs/core';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { Media } from './Media';
import { NewFileDialog } from './NewFileDialog';
import { FileTree, ITreeNodeFile } from './FileTree';
import { TagSearch } from './TagSearch';
import { ImagesModel } from '../models/imagesModel';
import { TagsModel } from '../models/tagsModel';

type MainProps = {};

type MainState = {
  files: ITreeNode[],
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
      files: this.getFilteredFiles(),
      tags: TagsModel.instance.getTags(),
      selectedTags: [],
      selectedImage: undefined,
      fileDropped: null
    };

    ImagesModel.instance.observe(() => {
      this.forceUpdate();
    });

    TagsModel.instance.observe(() => {
      this.forceUpdate();
    });
  }

  private transformToFiles(images: Image[]): ITreeNodeFile[] {
    return images.map(image => {
      return {
        id: `file_${image.path}`,
        label: path.basename(image.path),
        image: image
      } as ITreeNodeFile;
    });
  }

  getFilteredFiles(search: Tag[] = []): ITreeNode[] {
    return this.transformToFiles(ImagesModel.instance.getImages(search));
  }

  getFilesByTag() {
    const files: ITreeNode[] = [];
    const tags = TagsModel.instance.getTags();
    for (const tag of tags) {
      const tagFiles = this.transformToFiles(ImagesModel.instance.getImages([tag]));
      files.push({
        id: `folder_${tag.name}`,
        label: tag.name,
        childNodes: tagFiles
      });
    }
    return files;
  }

  onFileDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    this.setState({ fileDropped: file.path });
  }

  render() {
    return (
      <Dropzone onDrop={this.onFileDrop} noClick>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          <NewFileDialog
            newFilePath={this.state.fileDropped}
            onFinish={() => this.setState({ fileDropped: null })} />
          <SplitPane minSize={200} >
            <div style={{height: '100vh'}}>
              <TagSearch
                tags={this.state.tags}
                onChange={(tags) => this.setState({ selectedTags: tags })}/>
              <FileTree
                files={this.getFilteredFiles(this.state.selectedTags)}
                onSelect={path => this.setState({ selectedImage: path })}/>
            </div>
            <div style={{height: '100vh'}}>
              { this.state.selectedImage ? (
                <Media image={this.state.selectedImage} />
              ) : (
                <NonIdealState
                  icon={'unresolve'}
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
