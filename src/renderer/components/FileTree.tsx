import * as React from 'react';
import { ITreeNode, Tree, ContextMenu, Menu, MenuItem } from '@blueprintjs/core';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';

import { File } from '../data/file';
import { Tag } from '../data/tag';
import { selectFile, deleteFile, deleteTag, openEditTag, openEditFile } from '../actions/actions';

type FileTreeProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

export interface ITreeNodeFile extends ITreeNode {
  id: string;
  type: 'file' | 'folder';
  file?: File;
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

          const editFile = () => { this.props.onEditFile(treeNode.file!); };
          const editTag = () => { this.props.onEditTag(treeNode.tag!); };
          const onEdit = treeNode.type === 'file' ? editFile : editTag;

          const deleteFile = () => { this.props.onDeleteFile(treeNode.file!); };
          const deleteTag = () => { this.props.onDeleteTag(treeNode.tag!); };
          const onDelete = treeNode.type === 'file' ? deleteFile : deleteTag;

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

type OwnProps = { byTag?: boolean };

const MapStateToProps = (store: RootState, ownProps: OwnProps) => ({
  files: ownProps.byTag ? store.tag.files : store.search.files,
});

const MapDispatchToProps = (dispatch: AppDispatch, ownProps: OwnProps) => ({
  onSelect: (_nodeData: ITreeNode, nodePath: number[]) => dispatch(selectFile(ownProps.byTag ? 'tag' : 'search', nodePath)),
  onEditFile: (file: File) => dispatch(openEditFile(file)),
  onDeleteFile: (file: File) => dispatch(deleteFile(file)),
  onEditTag: (tag: Tag) => dispatch(openEditTag(tag)),
  onDeleteTag: (tag: Tag) => dispatch(deleteTag(tag)),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(FileTree);
