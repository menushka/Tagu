import * as React from 'react';
import { Dialog, Classes, Button } from '@blueprintjs/core';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';

import TagSearch from './TagSearch';

import { Tag } from '../data/tag';
import { cancelNewFile, saveNewFile } from '../actions/actions';

type NewFileDialogProps = ReturnType<typeof MergeProps>;

class NewFileDialog extends React.Component<NewFileDialogProps, {}> {
  render() {
    return (
      <Dialog
        title='Add new file...'
        isOpen={this.props.droppedFile != null}
        isCloseButtonShown={true}
        onClose={this.props.onClose}>
        <div className={Classes.DIALOG_BODY}>
          <img src={this.props.droppedFile!} style={{height: '30vh', width: '100%', objectFit: 'contain'}} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <TagSearch create={true}/>
          <Button text='Add File' onClick={this.props.onAdd} icon='add' fill={true} style={{ marginTop: '10px' }}/>
        </div>
      </Dialog>
    );
  }
}

const MapStateToProps = (store: RootState) => ({
  tags: store.allTags,
  droppedFile: store.new.droppedFile,
  selectedTags: store.new.selectedTags,
});

const MapDispatchToProps = (dispatch: AppDispatch) => ({
  onAdd: (path: string, tags: Tag[]) => dispatch(saveNewFile(path, tags)),
  onClose: () => dispatch(cancelNewFile()),
});

const MergeProps = (stateProps: ReturnType<typeof MapStateToProps>, dispatchProps: ReturnType<typeof MapDispatchToProps>) => {
  return Object.assign({}, stateProps, dispatchProps, {
    onAdd: () => dispatchProps.onAdd(stateProps.droppedFile!, stateProps.selectedTags),
  });
};

export default connect(
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
)(NewFileDialog);
