import * as React from 'react';
import { ImageDatabase, Image } from '../database';

import { ITreeNode, Tree, InputGroup, FormGroup, ControlGroup } from "@blueprintjs/core";

type MainProps = {}

type MainState = { files: ITreeNode[], search: '' }

export class Main extends React.Component<MainProps, MainState> {
  
  db: ImageDatabase;
  
  constructor(props: MainProps) {
    super(props);
    this.db = new ImageDatabase();
    this.db.connect();
    this.state = { files: this.transformToFiles(this.db.getAll()), search:'' }

    this.onSearchChange = this.onSearchChange.bind(this);
  }

  private transformToFiles(images: Image[]): ITreeNode[] {
    return images.map(x => {
      return {
        id: x.path,
        label: x.path
      } as ITreeNode
    });
  }

  private handleNodeCollapse = (nodeData: ITreeNode) => {
    nodeData.isExpanded = false;
    this.setState(this.state);
  };

  private handleNodeExpand = (nodeData: ITreeNode) => {
      nodeData.isExpanded = true;
      this.setState(this.state);
  };

  getFilteredImages(search: string): Image[] {
    return this.db.getAll(`ANY tags.name CONTAINS '${search}'`);
  }

  getFilteredByTag() {

  }

  onSearchChange(event: React.ChangeEvent<HTMLElement>) {
    this.setState({
      files: this.transformToFiles(this.getFilteredImages((event.target as HTMLTextAreaElement).value))
    });
  }

  render() {
    return (
      <ControlGroup style={{width: '100vw', height: '100vh'}}>
        <ControlGroup vertical={true} style={{width: '20vw', borderRight: '1px solid #eaeaea'}}>
          <FormGroup >
            <InputGroup id="text-input" placeholder="Search..." onChange={this.onSearchChange} />
          </FormGroup>
          <Tree 
            contents={this.state.files} 
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand} 
          />
        </ControlGroup>
        <ControlGroup vertical={true}>

        </ControlGroup>
      </ControlGroup>
    );
  }
}
