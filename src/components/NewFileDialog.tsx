import * as React from 'react';
import { Dialog, Classes, Button } from '@blueprintjs/core';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes } from '../store/types';
import { RootState } from '../store/store';

import { TagSearch } from './TagSearch';

import { TagsModel } from '../models/tagsModel';
import { Tag } from '../data/tag';
import { cancelNewFile, saveNewFile } from '../actions/actions';

type NewFileDialogProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

type NewFileDialogState = { tags: Tag[], selectedTags: Tag[] };

class NewFileDialog extends React.Component<NewFileDialogProps, NewFileDialogState> {
  constructor(props: NewFileDialogProps) {
    super(props);

    this.onFinish = this.onFinish.bind(this);

    this.state = { tags: TagsModel.instance.getTags(), selectedTags: [] };
  }

  onFinish() {
    this.props.onAdd(this.props.droppedFile!, this.state.selectedTags.filter(x => x.name.length > 0));
  }

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
          <TagSearch
            tags={this.state.tags}
            onChange={(tags) => this.setState({ selectedTags: tags })}
            create={true}/>
          <Button text='Add File' onClick={this.onFinish} icon='add' fill={true} style={{ marginTop: '10px' }}/>
        </div>
      </Dialog>
    );
  }
}

const MapStateToProps = (store: RootState) => ({
  droppedFile: store.droppedFile,
});

const MapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({
  onAdd: (path: string, tags: Tag[]) => dispatch(saveNewFile(path, tags)),
  onClose: () => dispatch(cancelNewFile()),
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(NewFileDialog);
