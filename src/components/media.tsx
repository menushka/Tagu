import * as React from "react";
import * as path from 'path';

type MediaProps = { path: string }

type MediaState = {}

export class Media extends React.Component<MediaProps, MediaState> {
  render() {
    return (
      <div style={{display: 'inline-block', width: 150, height: 150}} >
        <img src={path.join(__dirname, '../../', this.props.path)} style={{display: 'block', maxWidth: '100%', maxHeight: '100%', margin: 'auto'}} />
      </div>
    );
  }
}