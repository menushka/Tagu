import * as React from 'react';
import { ITreeNode, Tree } from '@blueprintjs/core';

type FileTreeProps = { files: ITreeNode[], onSelect: (path: string) => void };

type FileTreeState = {};

export interface ITreeNodeFile extends ITreeNode {
  file: string;
}

export class FileTree extends React.Component<FileTreeProps, FileTreeState> {

  private handleNodeClick = (nodeData: ITreeNode) => {
    if ((nodeData.id as string).startsWith('file')) {
      const originallySelected = nodeData.isSelected;
      this.forEachNode(this.props.files, n => (n.isSelected = false));
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

  render() {
    return (
      <Tree
        contents={this.props.files}
        onNodeClick={this.handleNodeClick}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
      />
    );
  }
}