import * as React from 'react';

import { Image } from '../data/image';

type MediaProps = { image: Image };

type MediaState = {};

export class Media extends React.Component<MediaProps, MediaState> {
  render() {
    return (
      <img src={Image.getAbsolutePath(this.props.image)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
    );
  }
}
