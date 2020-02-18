import * as React from 'react';
import { ImageDatabase as ImagesDatabase, Image, TagsDatabase } from '../database';
import Dropzone from 'react-dropzone';
import * as fs from 'fs-extra';
import * as path from 'path';

import { ITreeNode, Tree, InputGroup, Dialog, Classes, TagInput, Button, Icon } from '@blueprintjs/core';
import { Media } from './media';
import { IconNames } from '@blueprintjs/icons';

type MainProps = {};

type MainState = { files: ITreeNode[], selectedImage: string, newFile: string, newFileTags: string[] };

interface ITreeNodeFile extends ITreeNode {
  file: string;
}

export class Main extends React.Component<MainProps, MainState> {

  imagesDB: ImagesDatabase;
  tagsDB: TagsDatabase;

  constructor(props: MainProps) {
    super(props);
    this.imagesDB = new ImagesDatabase();
    this.imagesDB.connect();
    this.tagsDB = new TagsDatabase();
    this.tagsDB.connect();

    this.state = { files: this.transformToFiles(this.imagesDB.getAll()), selectedImage: '', newFile: '', newFileTags: [] };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onFileDrop = this.onFileDrop.bind(this);
    this.onFileDropFinished = this.onFileDropFinished.bind(this);
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

  private handleNodeClick = (nodeData: ITreeNode) => {
    if ((nodeData.id as string).startsWith('file')) {
      const originallySelected = nodeData.isSelected;
      this.forEachNode(this.state.files, n => (n.isSelected = false));
      nodeData.isSelected = originallySelected == null ? true : !originallySelected;

      this.setState(this.state);
      this.setState({
        selectedImage: (nodeData as ITreeNodeFile).file as string
      });
    } else {
      nodeData.isExpanded = !nodeData.isExpanded;
      this.setState(this.state);
    }
  }

  private handleNodeCollapse = (nodeData: ITreeNode) => {
    nodeData.isExpanded = false;
    this.setState(this.state);
  }

  private handleNodeExpand = (nodeData: ITreeNode) => {
      nodeData.isExpanded = true;
      this.setState(this.state);
  }

  private forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
    for (const node of nodes) {
        callback(node);
        this.forEachNode(node.childNodes ?? [], callback);
    }
  }

  getFilteredImages(search: string): Image[] {
    return this.imagesDB.getAll(`ANY tags.name CONTAINS '${search}'`);
  }

  getFilteredFiles(search: string): ITreeNode[] {
    if (search === '#tags') {
      const files: ITreeNode[] = [];
      const tags = this.tagsDB.getAll();
      for (const tag of tags) {
        const tagFiles = this.transformToFiles(this.getFilteredImages(tag.name));
        files.push({
          id: `folder_${tag.name}`,
          label: tag.name,
          childNodes: tagFiles
        });
      }
      return files;
    } else {
      return this.transformToFiles(this.getFilteredImages(search));
    }
  }

  onSearchChange(event: React.ChangeEvent<HTMLElement>) {
    this.setState({
      files: this.getFilteredFiles((event.target as HTMLTextAreaElement).value)
    });
  }

  onFileDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    const newFilePath = path.join(__dirname, '../../', 'images', path.basename(file.path));
    fs.ensureDirSync(path.join(__dirname, '../../', 'images'));
    fs.copySync(file.path, newFilePath);
    this.setState({ newFile: newFilePath });
  }

  onFileDropFinished() {
    this.setState({ newFile: '' });
  }

  render() {
    return (
      <Dropzone onDrop={this.onFileDrop} noClick>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Dialog
            title='Add new file...'
            isOpen={this.state.newFile !== ''}
            isCloseButtonShown={false}>
            <div className={Classes.DIALOG_BODY}>
              <img src={this.state.newFile} />
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <TagInput
                  onChange={(values: string[]) => this.setState({ newFileTags: values })}
                  values={this.state.newFileTags}
              />
              <Button text='Click' onClick={this.onFileDropFinished}/>
            </div>
          </Dialog>
          <div style={{display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh'}}>
            <div style={{width: '20vw', borderRight: '1px solid #eaeaea'}}>
              <InputGroup
                id='text-input'
                placeholder='Search...'
                type='search'
                leftIcon={<Icon icon={IconNames.SEARCH} />}
                onChange={this.onSearchChange}
                style={{}}/>
              <Tree
                contents={this.state.files}
                onNodeClick={this.handleNodeClick}
                onNodeCollapse={this.handleNodeCollapse}
                onNodeExpand={this.handleNodeExpand}
              />
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
