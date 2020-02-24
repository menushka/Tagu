import * as React from 'react';
import * as path from 'path';
import { ITreeNode, Tree, ContextMenu, Menu, MenuItem } from '@blueprintjs/core';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { ImagesModel } from '../models/imagesModel';
import { TagsModel } from '../models/tagsModel';

type FileTreeProps = { tags?: Tag[], byTag?: boolean, onSelect: (image: Image | undefined) => void };

type FileTreeState = { tags?: Tag[], files: ITreeNodeFile[] };

export interface ITreeNodeFile extends ITreeNode {
  type: 'file' | 'folder';
  image?: Image;
  tag?: Tag;
}

export class FileTree extends React.Component<FileTreeProps, FileTreeState> {
  constructor(props: FileTreeProps) {
    super(props);

    this.updateFileState = this.updateFileState.bind(this);

    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleNodeCollapse = this.handleNodeCollapse.bind(this);
    this.handleNodeExpand = this.handleNodeExpand.bind(this);
    this.forEachNode = this.forEachNode.bind(this);

    this.contextMenuOnEdit = this.contextMenuOnEdit.bind(this);
    this.contextMenuOnDelete = this.contextMenuOnDelete.bind(this);

    ImagesModel.instance.observe(this.updateFileState);
    TagsModel.instance.observe(this.updateFileState);

    this.state = {
      tags: this.props.tags,
      files: this.props.byTag ? this.getFilesByTag() : this.getFilteredFiles(this.props.tags)
    };
  }

  updateFileState() {
    this.setState({
      files: this.props.byTag ? this.getFilesByTag() : this.getFilteredFiles(this.state.tags)
    });
  }

  transformToFiles(images: Image[]): ITreeNodeFile[] {
    return images.map(image => {
      return {
        id: `file_${image.path}`,
        label: path.basename(image.path),
        type: 'file',
        image: image
      } as ITreeNodeFile;
    });
  }

  getFilteredFiles(search: Tag[] = []): ITreeNodeFile[] {
    return this.transformToFiles(ImagesModel.instance.getImages(search));
  }

  getFilesByTag(): ITreeNodeFile[] {
    const files: ITreeNodeFile[] = [];
    const tags = TagsModel.instance.getTags();
    for (const tag of tags) {
      const tagFiles = this.transformToFiles(ImagesModel.instance.getImages([tag]));
      files.push({
        id: `folder_${tag.name}`,
        label: tag.name,
        type: 'folder',
        tag: tag,
        childNodes: tagFiles
      });
    }
    return files;
  }

  handleNodeClick = (nodeData: ITreeNode) => {
    if ((nodeData.id as string).startsWith('file')) {
      const originallySelected = nodeData.isSelected;
      this.forEachNode(this.state.files, n => (n.isSelected = false));
      nodeData.isSelected = originallySelected == null ? true : !originallySelected;

      this.setState(this.state);
      this.props.onSelect((nodeData as ITreeNodeFile).image);
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

  private contextMenuOnEdit(node: ITreeNode) {
    console.log(`Edit not implemented yet. Node: ${node}`);
  }

  private contextMenuOnDelete(node: ITreeNodeFile) {
    if (node.isSelected) { this.props.onSelect(undefined); }
    switch (node.type) {
      case 'file':
        ImagesModel.instance.removeImage(node.image!);
        break;
      case 'folder':
        TagsModel.instance.removeTag(node.tag!);
        break;
    }
  }

  componentWillReceiveProps(nextProps: FileTreeProps) {
    this.setState({ tags: nextProps.tags }, () => {
      this.updateFileState();
    });
  }

  render() {
    return (
      <Tree
        contents={this.state.files}
        onNodeClick={this.handleNodeClick}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        onNodeContextMenu={(node, _nodePath, e) => {
          e.preventDefault();

          const menu = React.createElement(
              Menu,
              {}, // empty props
              <MenuItem onClick={() => this.contextMenuOnEdit(node as ITreeNodeFile)} text='Edit' />,
              <MenuItem onClick={() => this.contextMenuOnDelete(node as ITreeNodeFile)} text='Delete' />
          );

          ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => {
              // menu was closed; callback optional
          });
        }}
      />
    );
  }
}
