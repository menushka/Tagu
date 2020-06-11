import * as React from 'react';
import { Dialog, Classes, Button, FileInput, Label } from '@blueprintjs/core';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';

import { closePreferences } from '../actions/actions';

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

  setDataPath = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ dataPath: e.target.value });
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
          <FileInput text={this.state.dataPath} onInputChange={this.setDataPath} fill={true} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button text='Save' onClick={this.props.onSave} icon='saved' fill={true} style={{ marginTop: '10px' }}/>
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
  onSave: () => { console.log('Implement'); },
});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(PreferencesDialog);
