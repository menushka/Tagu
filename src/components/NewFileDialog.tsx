import * as React from 'react';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Dialog, Classes, Button } from '@blueprintjs/core';

import { TagSearch } from './tagSearch';

import { TagsModel } from '../models/tagsModel';
import { Tag } from '../data/tag';
import { ImagesModel } from '../models/imagesModel';
import { Image } from '../data/image';

type NewFileDialogProps = { newFilePath: string | null, onFinish: () => void };

type NewFileDialogState = { selectedTags: Tag[] };

export class NewFileDialog extends React.Component<NewFileDialogProps, NewFileDialogState> {
  constructor(props: NewFileDialogProps) {
    super(props);

    this.onFinish = this.onFinish.bind(this);

    this.state = { selectedTags: [] };
  }

  onFinish() {
    const fileName = path.basename(this.props.newFilePath!);
    const newFilePath = path.join(__dirname, '../../', 'images', fileName);
    fs.ensureDirSync(path.join(__dirname, '../../', 'images'));
    fs.copySync(this.props.newFilePath!, newFilePath);
    ImagesModel.instance.addImage(new Image(fileName, this.state.selectedTags));

    this.setState({ selectedTags: [] });
    this.props.onFinish();
  }

  render() {
    return (
      <Dialog
        title='Add new file...'
        isOpen={this.props.newFilePath != null}
        isCloseButtonShown={false}>
        <div className={Classes.DIALOG_BODY}>
          <img src={this.props.newFilePath!} style={{height: '30vh', width: '100%', objectFit: 'contain'}} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <TagSearch
            tags={TagsModel.instance.getTags()}
            onChange={(tags) => this.setState({ selectedTags: tags })}
            create={true}/>
          <Button text='Click' onClick={this.onFinish}/>
        </div>
      </Dialog>
    );
  }
}
