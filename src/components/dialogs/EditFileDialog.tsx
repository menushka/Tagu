import * as React from 'react';
import { Dialog, Classes, Button } from '@blueprintjs/core';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import TagSearch from '../TagSearch';

import { Tag } from '../../data/tag';
import { updateEditFile, closeEditFile } from '../../actions/actions';
import { File } from '../../data/file';
import Media from '../Media';

type EditFileDialogState = {
  selectedTags: null | Tag[],
};

type EditFileDialogProps = ReturnType<typeof MergeProps>;

class EditFileDialog extends React.Component<EditFileDialogProps, EditFileDialogState> {
  constructor(props: EditFileDialogProps) {
    super(props);

    this.state = {
      selectedTags: null,
    };
  }

  componentDidUpdate(prevProps: EditFileDialogProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({ selectedTags: [...this.props.file!.tags] });
    } else if (!this.props.isOpen && prevProps.isOpen) {
      this.setState({ selectedTags: null });
    }
  }

  onSelectedTagsChange = (tags: Tag[]) => {
    this.setState({ selectedTags: tags });
  };

  onSave = (_event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.props.onSave(this.state.selectedTags!);
  };

  render() {
    return (
      <Dialog
        title='Edit File'
        isOpen={this.props.isOpen}
        isCloseButtonShown={true}
        onClose={this.props.onClose}>
        <div className={Classes.DIALOG_BODY}>
          <Media image={this.props.file} style={{height: '30vh', width: '100%', objectFit: 'contain'}} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          { this.state.selectedTags !== null && // Ensures initialTags are sent when the componentMounts
            <TagSearch onChange={this.onSelectedTagsChange} initialTags={this.state.selectedTags!} create={true}/>
          }
          <Button text='Save' onClick={this.onSave} icon='saved' fill={true} style={{ marginTop: '10px' }}/>
        </div>
      </Dialog>
    );
  }
}

const MapStateToProps = (store: RootState) => ({
  isOpen: store.editFile.file !== null,
  file: store.editFile.file,
});

const MapDispatchToProps = (dispatch: AppDispatch) => ({
  onSave: (file: File, tags: Tag[]) => {
    dispatch(updateEditFile(file, tags));
    dispatch(closeEditFile());
  },
  onClose: () => dispatch(closeEditFile()),
});

const MergeProps = (stateProps: ReturnType<typeof MapStateToProps>, dispatchProps: ReturnType<typeof MapDispatchToProps>) => {
  return Object.assign({}, stateProps, dispatchProps, {
    onSave: (tags: Tag[]) => dispatchProps.onSave(stateProps.file!, tags),
  });
};

export default connect(
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
)(EditFileDialog);
