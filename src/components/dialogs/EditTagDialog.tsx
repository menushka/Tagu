import * as React from 'react';
import { Dialog, Classes, Button, Label, InputGroup } from '@blueprintjs/core';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import { closeEditTag, updateEditTag } from '../../actions/actions';
import { Tag } from '../../data/tag';

type EditTagState = {
  tagName: string,
};

type EditTagProps = ReturnType<typeof MergeProps>;

class EditTagDialog extends React.Component<EditTagProps, EditTagState> {
  constructor(props: EditTagProps) {
    super(props);

    this.state = {
      tagName: '',
    };
  }

  componentDidUpdate(prevProps: EditTagProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({ tagName: this.props.tag!.name });
    }
  }

  onTagNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ tagName: event.target.value });
  }

  onSave = (_event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.props.onSave(this.state.tagName);
  }

  render() {
    return (
      <Dialog
        title={'Edit Tag - "' + (this.props.tag?.name ?? '') + '"'}
        isOpen={this.props.isOpen}
        isCloseButtonShown={true}
        onClose={this.props.onClose}>
        <div className={Classes.DIALOG_BODY}>
          <Label style={{ marginBottom: '5px' }}>New Tag Name</Label>
          <InputGroup value={this.state.tagName} onChange={this.onTagNameChange} fill={true} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button text='Save' onClick={this.onSave} icon='saved' fill={true} style={{ marginTop: '10px' }}/>
        </div>
      </Dialog>
    );
  }
}

const MapStateToProps = (store: RootState) => ({
  isOpen: store.editTag.tag !== null,
  tag: store.editTag.tag,
});

const MapDispatchToProps = (dispatch: AppDispatch) => ({
  onClose: () => dispatch(closeEditTag()),
  onSave: (tag: Tag, tagName: string) => {
    dispatch(updateEditTag(tag, tagName));
    dispatch(closeEditTag());
  },
});

const MergeProps = (stateProps: ReturnType<typeof MapStateToProps>, dispatchProps: ReturnType<typeof MapDispatchToProps>) => {
  return Object.assign({}, stateProps, dispatchProps, {
    onSave: (tagName: string) => dispatchProps.onSave(stateProps.tag!, tagName),
  });
};

export default connect(
  MapStateToProps,
  MapDispatchToProps,
  MergeProps,
)(EditTagDialog);
