import * as React from 'react';
import { Search } from './search';
import { Media } from './media';
import { ImageDatabase, Image } from '../database';

type MainProps = {}

type MainState = { search: string }

export class Main extends React.Component<MainProps, MainState> {
  
  db: ImageDatabase;
  
  constructor(props: MainProps) {
    super(props);
    this.db = new ImageDatabase();
    this.db.connect()
    this.state = { search: '' }
  }
  
  getFilteredImages(search: string): Image[] {
    return this.db.getAll(`ANY tags.name CONTAINS '${search}'`);
  }
  
  render() {
    const images = this.getFilteredImages(this.state.search);
    return (
      <div>
        <Search onChange={(value: string) => {
          this.setState({ search: value })
        }} />
        { images.map(image => <Media key={image.path} path={image.path} />) }
      </div>
    );
  }
}