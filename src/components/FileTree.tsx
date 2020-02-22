import * as React from 'react';
import { ITreeNode, Tree, ContextMenu, Menu, MenuItem } from '@blueprintjs/core';
import { ImagesModel } from '../models/imagesModel';

type FileTreeProps = { files: ITreeNode[], onSelect: (path: string) => void };

type FileTreeState = { files: ITreeNode[]};

export interface ITreeNodeFile extends ITreeNode {
  file: string;
}

export class FileTree extends React.Component<FileTreeProps, FileTreeState> {
  constructor(props: FileTreeProps) {
    super(props);

    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleNodeCollapse = this.handleNodeCollapse.bind(this);
    this.handleNodeExpand = this.handleNodeExpand.bind(this);
    this.forEachNode = this.forEachNode.bind(this);

    this.contextMenuOnEdit = this.contextMenuOnEdit.bind(this);
    this.contextMenuOnDelete = this.contextMenuOnDelete.bind(this);

    this.state = { files: this.props.files };
  }

  private handleNodeClick = (nodeData: ITreeNode) => {
    if ((nodeData.id as string).startsWith('file')) {
      const originallySelected = nodeData.isSelected;
      this.forEachNode(this.state.files, n => (n.isSelected = false));
      nodeData.isSelected = originallySelected == null ? true : !originallySelected;

      this.setState(this.state);
      this.props.onSelect((nodeData as ITreeNodeFile).file as string);
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
    const deleteImagePath = node.id.toString().substr(5);
    const deleteImage = ImagesModel.instance.getImages().find(x => x.path == deleteImagePath);
    ImagesModel.instance.removeImage(deleteImage!);
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
