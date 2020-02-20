import * as React from 'react';
import { Dialog, Classes, Button } from '@blueprintjs/core';

type NewFileDialogProps = { newFilePath: string, isOpen: boolean, onFinish: () => void };

type NewFileDialogState = {};

export class NewFileDialog extends React.Component<NewFileDialogProps, NewFileDialogState> {
  render() {
    return (
      <Dialog
        title='Add new file...'
        isOpen={this.props.isOpen}
        isCloseButtonShown={false}>
        <div className={Classes.DIALOG_BODY}>
          <img src={this.props.newFilePath} style={{height: '30vh'}} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button text='Click' onClick={this.props.onFinish}/>
        </div>
      </Dialog>
    );
  }
}
