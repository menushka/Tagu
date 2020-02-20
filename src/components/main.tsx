import * as React from 'react';
import Dropzone from 'react-dropzone';
import * as fs from 'fs-extra';
import * as path from 'path';

import { ITreeNode, MenuItem } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { ImagesDatabase } from '../db/imagesDatabase';
import { TagsDatabase } from '../db/tagsDatabase';
import { Media } from './media';
import { NewFileDialog } from './newFileDialog';
import { FileTree, ITreeNodeFile } from './fileTree';

type MainProps = {};

type MainState = { files: ITreeNode[], tags: Tag[], selectedTags: Tag[], selectedImage: string, newFile: string, newFileTags: string[] };

const TagMultiSelect = MultiSelect.ofType<Tag>();

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
  }

  private transformToFiles(images: Image[]): ITreeNodeFile[] {
    return images.map(x => {
      return {
        id: `file_${x.path}`,
        file: x.path,
        label: x.path
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

  render() {
    return (
      <Dropzone onDrop={this.onFileDrop} noClick>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          <NewFileDialog newFilePath={this.state.newFile} isOpen={this.state.newFile !== ''} onFinish={() => this.setState({ newFile: '' })} />
          <div style={{display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh'}}>
            <div style={{width: '20vw', borderRight: '1px solid #eaeaea'}}>
              <TagMultiSelect
                fill={true}
                items={this.state.tags}
                selectedItems={this.state.selectedTags}
                onItemSelect={(tag) => {
                  const currentTags = this.state.selectedTags;
                  currentTags.push(tag);
                  this.setState({ selectedTags: currentTags });
                }}
                itemRenderer={(tag, { modifiers, handleClick }) => {
                  return (
                    <MenuItem
                      active={modifiers.active}
                      key={tag.name}
                      label={tag.name}
                      onClick={handleClick}
                      shouldDismissPopover={false}
                  />
                );
                }}
                tagRenderer={tag => tag.name}
                tagInputProps={{
                  onRemove: (_value, index) => {
                    const currentTags = this.state.selectedTags;
                    currentTags.splice(index, 1);
                    this.setState({ selectedTags: currentTags });
                  },
                  placeholder: 'Search...',
                  leftIcon: 'search'
                }}/>
              <FileTree files={this.getFilteredFiles(this.state.selectedTags)} onSelect={path => this.setState({ selectedImage: path })}/>
            </div>
            <div style={{flexGrow: 1}}>
              <Media path={this.state.selectedImage} />
            </div>
          </div>
          </div>
        )}
      </Dropzone>
    );
  }
}
