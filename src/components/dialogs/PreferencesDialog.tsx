import * as React from 'react';
import { Dialog, Classes, Button, FileInput, Label } from '@blueprintjs/core';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import { closePreferences, writePreferencesFile } from '../../actions/actions';
import { showOpenDialog } from '../../electron/fileDialog';
import { IPreferences } from '../../persistent/preferences';

type PreferencesDialogState = {
  dataPath: string,
};

type PreferencesDialogProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

class PreferencesDialog extends React.Component<PreferencesDialogProps, PreferencesDialogState> {
  constructor(props: PreferencesDialogProps) {
    super(props);

    this.state = {
      dataPath: props.savedDataPath,
    };
  }

  onFileInputClick = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    showOpenDialog(
      'Select Database',
      'Select new or existing database.  Choosing an empty directory will create a database in that directory.',
      'Create / Open',
    ).then((data) => {
      if (data?.length ?? 0 > 0) {
        this.setState({ dataPath: data![0] });
      }
    });
  }

  onSave = (_event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.props.onSave({
      dataPath: this.state.dataPath,
    });
  }

  render() {
    return (
      <Dialog
        title='Preferences'
        isOpen={this.props.isOpen}
        isCloseButtonShown={true}
        onClose={this.props.onClose}>
        <div className={Classes.DIALOG_BODY}>
          <Label style={{ marginBottom: '5px' }}>Data Path</Label>
          <FileInput text={this.state.dataPath} onClick={this.onFileInputClick} fill={true} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button text='Save' onClick={this.onSave} icon='saved' fill={true} style={{ marginTop: '10px' }}/>
        </div>
      </Dialog>
    );
  }
}

const MapStateToProps = (store: RootState) => ({
  isOpen: store.preferences.open,
  savedDataPath: store.preferences.dataPath,
});

const MapDispatchToProps = (dispatch: AppDispatch) => ({
  onClose: () => dispatch(closePreferences()),
  onSave: (preferences: IPreferences) => {
    dispatch(writePreferencesFile(preferences));
    dispatch(closePreferences());
  },
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(PreferencesDialog);
