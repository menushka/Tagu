import * as React from 'react';
import { ITreeNode, Tree, ContextMenu, Menu, MenuItem } from '@blueprintjs/core';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes } from '../store/types';
import { RootState } from '../store/store';

import { Image } from '../data/image';
import { Tag } from '../data/tag';
import { selectFile, deleteFile, deleteTag } from '../actions/actions';

type OwnProps = { byTag?: boolean };

type FileTreeProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

export interface ITreeNodeFile extends ITreeNode {
  id: string;
  type: 'file' | 'folder';
  image?: Image;
  tag?: Tag;
}

class FileTree extends React.Component<FileTreeProps, {}> {
  render() {
    return (
      <Tree
        contents={this.props.files}
        onNodeClick={this.props.onSelect}
        onNodeCollapse={this.props.onSelect}
        onNodeExpand={this.props.onSelect}
        onNodeContextMenu={(node, _nodePath, e) => {
          e.preventDefault();

          const treeNode = (node as ITreeNodeFile);

          const onEdit = () => { console.log('Not yet implemented'); };

          const deleteImage = () => { this.props.onDeleteImage(treeNode.image!); };
          const deleteTag = () => { this.props.onDeleteTag(treeNode.tag!); };
          const onDelete = treeNode.type === 'file' ? deleteImage : deleteTag;

          const menu = React.createElement(
              Menu,
              {}, // empty props
              <MenuItem onClick={onEdit} text='Edit' />,
              <MenuItem onClick={onDelete} text='Delete' />,
          );

          ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
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
  onDeleteImage: (image: Image) => dispatch(deleteFile(image)),
  onDeleteTag: (tag: Tag) => dispatch(deleteTag(tag)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(FileTree);
