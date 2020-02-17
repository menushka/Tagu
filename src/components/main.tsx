import * as React from 'react';
import { ImageDatabase as ImagesDatabase, Image, TagsDatabase } from '../database';

import { ITreeNode, Tree, InputGroup, FormGroup, ControlGroup } from '@blueprintjs/core';
import { Media } from './media';

type MainProps = {};

type MainState = { files: ITreeNode[], selectedImage: string };

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

    this.state = { files: this.transformToFiles(this.imagesDB.getAll()), selectedImage: '' };

    this.onSearchChange = this.onSearchChange.bind(this);
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

  render() {
    return (
      <ControlGroup style={{width: '100vw', height: '100vh'}}>
        <ControlGroup vertical={true} style={{width: '20vw', borderRight: '1px solid #eaeaea'}}>
          <FormGroup >
            <InputGroup id='text-input' placeholder='Search...' onChange={this.onSearchChange} />
          </FormGroup>
          <Tree
            contents={this.state.files}
            onNodeClick={this.handleNodeClick}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
          />
        </ControlGroup>
        <ControlGroup vertical={true}  fill={true}>
          <Media path={this.state.selectedImage} />
        </ControlGroup>
      </ControlGroup>
    );
  }
}
