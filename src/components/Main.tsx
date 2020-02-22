import * as React from 'react';
import Dropzone from 'react-dropzone';
import * as fs from 'fs-extra';
import * as path from 'path';
import SplitPane from 'react-split-pane';

import { ITreeNode, NonIdealState } from '@blueprintjs/core';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { ImagesDatabase } from '../db/imagesDatabase';
import { TagsDatabase } from '../db/tagsDatabase';
import { Media } from './Media';
import { NewFileDialog } from './NewFileDialog';
import { FileTree, ITreeNodeFile } from './FileTree';
import { TagSearch } from './TagSearch';

type MainProps = {};

type MainState = {
  files: ITreeNode[],
  tags: Tag[],
  selectedTags: Tag[],
  selectedImage: string,
  newFile: string,
  newFileTags: string[]
};

export class Main extends React.Component<MainProps, MainState> {

  imagesDB: ImagesDatabase;
  tagsDB: TagsDatabase;

  constructor(props: MainProps) {
    super(props);
    this.imagesDB = new ImagesDatabase();
    this.imagesDB.connect();
    this.tagsDB = new TagsDatabase();
    this.tagsDB.connect();

    this.state = {
      files: this.transformToFiles(this.imagesDB.getAll()),
      tags: this.tagsDB.getAll(),
      selectedTags: [],
      selectedImage: '',
      newFile: '',
      newFileTags: []
    };

    this.onFileDrop = this.onFileDrop.bind(this);
    this.onSearchTagSelect = this.onSearchTagSelect.bind(this);
    this.onSearchTagRemove = this.onSearchTagRemove.bind(this);
  }

  private transformToFiles(images: Image[]): ITreeNodeFile[] {
    return images.map(x => {
      return {
        id: `file_${x.path}`,
        file: x.path,
        label: path.basename(x.path)
      } as ITreeNodeFile;
    });
  }

  getFilteredImages(search: Tag[]): Image[] {
    if (search.length === 0) {
      return this.imagesDB.getAll();
    } else {
      const filter = search.map(x => `ANY tags.name CONTAINS '${x.name}'`).join(' AND ');
      return this.imagesDB.getAll(filter);
    }
  }

  getFilteredFiles(search: Tag[]): ITreeNode[] {
    return this.transformToFiles(this.getFilteredImages(search));
  }

  getFilesByTag() {
    const files: ITreeNode[] = [];
    const tags = this.tagsDB.getAll();
    for (const tag of tags) {
      const tagFiles = this.transformToFiles(this.getFilteredImages([tag]));
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
    const newFilePath = path.join(__dirname, '../../', 'images', path.basename(file.path));
    fs.ensureDirSync(path.join(__dirname, '../../', 'images'));
    fs.copySync(file.path, newFilePath);
    this.setState({ newFile: newFilePath });
  }

  onSearchTagSelect(tag: Tag) {
    const currentTags = this.state.selectedTags;
    currentTags.push(tag);
    this.setState({ selectedTags: currentTags });
  }

  onSearchTagRemove(index: number) {
    const currentTags = this.state.selectedTags;
    currentTags.splice(index, 1);
    this.setState({ selectedTags: currentTags });
  }

  render() {
    return (
      <Dropzone onDrop={this.onFileDrop} noClick>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          <NewFileDialog
            newFilePath={this.state.newFile}
            isOpen={this.state.newFile !== ''}
            onFinish={() => this.setState({ newFile: '' })} />
          <SplitPane minSize={200} >
            <div style={{height: '100vh'}}>
              <TagSearch
                tags={this.state.tags}
                selectedTags={this.state.selectedTags}
                onSelect={this.onSearchTagSelect}
                onRemove={this.onSearchTagRemove}/>
              <FileTree files={this.getFilteredFiles(this.state.selectedTags)} onSelect={path => this.setState({ selectedImage: path })}/>
            </div>
            <div style={{height: '100vh'}}>
              { this.state.selectedImage ? (
                <Media path={this.state.selectedImage} />
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
