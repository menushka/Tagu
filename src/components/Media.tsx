import * as React from 'react';
import * as path from 'path';

type MediaProps = { path: string };

type MediaState = {};

export class Media extends React.Component<MediaProps, MediaState> {
  render() {
    return (
      <img src={path.join(__dirname, '../../images/', this.props.path)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
    );
  }
}
