import * as React from 'react';

type SearchProps = { onChange: (value: string) => void };

type SearchState = { value: string };

export class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: '' };
  }

  handleChange(event: React.FormEvent<EventTarget>) {
    this.setState({ value: (event.target as HTMLInputElement).value });
    this.props.onChange((event.target as HTMLInputElement).value);
  }

  render() {
    return (
      <div>
        <input type='text' value={this.state.value} onChange={this.handleChange} />
      </div>
    );
  }
}