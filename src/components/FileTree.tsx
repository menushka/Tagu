import * as React from 'react';
import { ITreeNode, Tree, ContextMenu, Menu, MenuItem } from '@blueprintjs/core';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes } from '../store/types';
import { RootState } from '../store/store';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { ImagesModel } from '../models/imagesModel';
import { TagsModel } from '../models/tagsModel';
import { selectFile } from '../actions/actions';

type OwnProps = { byTag?: boolean };

type FileTreeProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

export interface ITreeNodeFile extends ITreeNode {
  type: 'file' | 'folder';
  image?: Image;
  tag?: Tag;
}

class FileTree extends React.Component<FileTreeProps, {}> {
  constructor(props: FileTreeProps) {
    super(props);

    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleNodeCollapse = this.handleNodeCollapse.bind(this);
    this.handleNodeExpand = this.handleNodeExpand.bind(this);
    this.forEachNode = this.forEachNode.bind(this);

    this.contextMenuOnEdit = this.contextMenuOnEdit.bind(this);
    this.contextMenuOnDelete = this.contextMenuOnDelete.bind(this);
  }

  handleNodeClick = (nodeData: ITreeNode) => {
    if ((nodeData.id as string).startsWith('file')) {
      const originallySelected = nodeData.isSelected;
      this.forEachNode(this.props.files, n => (n.isSelected = false));
      nodeData.isSelected = originallySelected == null ? true : !originallySelected;

      this.setState(this.state);
      this.props.onSelect((nodeData as ITreeNodeFile).image!);
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
    if (node.isSelected) { this.props.onSelect(null); }
    switch (node.type) {
      case 'file':
        ImagesModel.instance.removeImage(node.image!);
        break;
      case 'folder':
        TagsModel.instance.removeTag(node.tag!);
        break;
    }
  }

  render() {
    return (
      <Tree
        contents={this.props.files}
        onNodeClick={this.handleNodeClick}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
        onNodeContextMenu={(node, _nodePath, e) => {
          e.preventDefault();

          const menu = React.createElement(
              Menu,
              {}, // empty props
              <MenuItem onClick={() => this.contextMenuOnEdit(node as ITreeNodeFile)} text='Edit' />,
              <MenuItem onClick={() => this.contextMenuOnDelete(node as ITreeNodeFile)} text='Delete' />,
          );

          ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => {
              // menu was closed; callback optional
          });
        }}
      />
    );
  }
}

const MapStateToProps = (store: RootState, ownProps: OwnProps) => {
  if (ownProps.byTag) {
    return {
      byTag: ownProps.byTag,
      files: store.tag.files,
    };
  } else {
    return {
      byTag: ownProps.byTag,
      files: store.search.files,
    };
  }
};

const MapDispatchToProps = (dispatch: Dispatch<ActionTypes>, ownProps: OwnProps) => {
  if (ownProps.byTag) {
    return {
      onSelect: (path: Image | null) => dispatch(selectFile('tag', path)),
    };
  } else {
    return {
      onSelect: (path: Image | null) => dispatch(selectFile('search', path)),
    };
  }
};

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(FileTree);
