import * as React from 'react';
import { ImageDatabase, Image } from './database';

type AppProps = {}

export class App extends React.Component<AppProps, undefined> {
  
  db: ImageDatabase;
  
  constructor(props: AppProps) {
    super(props);
    this.db = new ImageDatabase();
    this.db.connect()
    this.db.write(new Image('./test'))
  }
  render() {
    return (
      <div>
        <h2>Welcome to React with Typescript!</h2>
        { this.db.getAll().map(x => <div key={x.path}>{x.path}</div>) }
      </div>
    );
  }
}
