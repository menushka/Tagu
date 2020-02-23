import * as React from 'react';
import { Dialog, Classes, Button } from '@blueprintjs/core';

import { TagSearch } from './tagSearch';

import { TagsModel } from '../models/tagsModel';
import { Tag } from '../data/tag';
import { ImagesModel } from '../models/imagesModel';

type NewFileDialogProps = { newFilePath: string | null, onFinish: () => void };

type NewFileDialogState = { tags: Tag[], selectedTags: Tag[] };

export class NewFileDialog extends React.Component<NewFileDialogProps, NewFileDialogState> {
  constructor(props: NewFileDialogProps) {
    super(props);

    this.onFinish = this.onFinish.bind(this);

    this.state = { tags: TagsModel.instance.getTags(), selectedTags: [] };
  }

  componentDidMount() {
    this.setState({ tags: TagsModel.instance.getTags(), selectedTags: [] });
  }

  onFinish() {
    ImagesModel.instance.addImage(this.props.newFilePath!, this.state.selectedTags);
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
            tags={this.state.tags}
            onChange={(tags) => this.setState({ selectedTags: tags })}
            create={true}/>
          <Button text='Click' onClick={this.onFinish}/>
        </div>
      </Dialog>
    );
  }
}
