import * as React from 'react';

import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';

import { Image } from '../data/image';
import { NonIdealState } from '@blueprintjs/core';

type MediaProps = ReturnType<typeof MapStateToProps> & ReturnType<typeof MapDispatchToProps>;

class Media extends React.Component<MediaProps, {}> {
  render() {
    return ( this.props.image ?
      (<img src={Image.getAbsolutePath(this.props.image!, this.props.dataPath)} style={this.props.style} />)
      :
      (<NonIdealState
        icon={'help'}
        title='Nothing selected'
        description={'No displayable item is selected in the left column.'} />)
    );
  }
}

type OwnProps = {
  image?: Image | null;
  style?: React.CSSProperties;
};

const MapStateToProps = (store: RootState, ownProps: OwnProps) => ({
  image: ownProps.image,
  style: ownProps.style,
  dataPath: store.preferences.dataPath,
});

const MapDispatchToProps = (_dispatch: AppDispatch) => ({});

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(Media);
