import * as React from 'react';
import { ITreeNode, Tree, ContextMenu, Menu, MenuItem } from '@blueprintjs/core';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes } from '../store/types';
import { RootState } from '../store/store';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
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

    this.contextMenuOnEdit = this.contextMenuOnEdit.bind(this);
    this.contextMenuOnDelete = this.contextMenuOnDelete.bind(this);
  }

  private contextMenuOnEdit(node: ITreeNode) {
    console.log(`Edit not implemented yet. Node: ${node}`);
  }

  private contextMenuOnDelete(node: ITreeNodeFile) {
    // if (node.isSelected) { this.props.onSelect(null); }
    // switch (node.type) {
    //   case 'file':
    //     ImagesModel.instance.removeImage(node.image!);
    //     break;
    //   case 'folder':
    //     TagsModel.instance.removeTag(node.tag!);
    //     break;
    // }
  }

  render() {
    return (
      <Tree
        contents={this.props.files}
        onNodeClick={this.props.onSelect}
        onNodeCollapse={this.props.onCollapse}
        onNodeExpand={this.props.onExpand}
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

const MapStateToProps = (store: RootState, ownProps: OwnProps) => ({
  files: ownProps.byTag ? store.tag.files : store.search.files,
});

const MapDispatchToProps = (dispatch: Dispatch<ActionTypes>, ownProps: OwnProps) => ({
  onSelect: (_nodeData: ITreeNode, nodePath: number[]) => dispatch(selectFile(ownProps.byTag ? 'tag' : 'search', nodePath)),
  onExpand: (_nodeData: ITreeNode, nodePath: number[]) => dispatch(selectFile(ownProps.byTag ? 'tag' : 'search', nodePath)),
  onCollapse: (_nodeData: ITreeNode, nodePath: number[]) => dispatch(selectFile(ownProps.byTag ? 'tag' : 'search', nodePath)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(FileTree);
