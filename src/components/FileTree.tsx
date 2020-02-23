import * as React from 'react';
import * as path from 'path';
import { ITreeNode, Tree, ContextMenu, Menu, MenuItem } from '@blueprintjs/core';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { ImagesModel } from '../models/imagesModel';
import { TagsModel } from '../models/tagsModel';

type FileTreeProps = { tags: Tag[], onSelect: (image: Image | undefined) => void };

type FileTreeState = { files: ITreeNodeFile[] };

export interface ITreeNodeFile extends ITreeNode {
  image: Image;
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

    this.state = { files: this.getFilteredFiles(this.props.tags) };

    ImagesModel.instance.observe(this.updateFileState);
  }

  updateFileState() {
    this.setState({ files: this.getFilteredFiles(this.props.tags) });
  }

  transformToFiles(images: Image[]): ITreeNodeFile[] {
    return images.map(image => {
      return {
        id: `file_${image.path}`,
        label: path.basename(image.path),
        image: image
      } as ITreeNodeFile;
    });
  }

  getFilteredFiles(search: Tag[] = []): ITreeNodeFile[] {
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

  private contextMenuOnDelete(node: ITreeNode) {
    if (node.isSelected) { this.props.onSelect(undefined); }
    this.updateFileState();

    const deleteImagePath = node.id.toString().substr(5);
    const deleteImage = ImagesModel.instance.getImages().find(x => x.path == deleteImagePath);
    ImagesModel.instance.removeImage(deleteImage!);
  }

  componentWillReceiveProps(nextProps: FileTreeProps) {
    if (this.props.tags != nextProps.tags) {
      this.updateFileState();
    }
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
              <MenuItem onClick={() => this.contextMenuOnEdit(node)} text='Edit' />,
              <MenuItem onClick={() => this.contextMenuOnDelete(node)} text='Delete' />
          );

          ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => {
              // menu was closed; callback optional
          });
        }}
      />
    );
  }
}
