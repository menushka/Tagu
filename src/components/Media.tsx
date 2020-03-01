import * as React from 'react';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ActionTypes } from '../store/types';
import { RootState } from '../store/store';

import { Image } from '../data/image';
import { NonIdealState } from '@blueprintjs/core';

type MediaProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

class Media extends React.Component<MediaProps, {}> {
  render() {
    return ( this.props.image ?
      (<img src={Image.getAbsolutePath(this.props.image!)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />)
      :
      (<NonIdealState
        icon={'help'}
        title='Nothing selected'
        description={'No displayable item is selected in the left column.'} />)
    );
  }
}

const MapStateToProps = (store: RootState) => ({
  image: store.leftColumnId === 'search' ? store.search.selectedFile : store.tag.selectedFile,
});

const MapDispatchToProps = (_dispatch: Dispatch<ActionTypes>) => ({});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(Media);
