import * as React from "react";

type SearchProps = { onChange: () => void }

type SearchState = { value: string }

export class Search extends React.Component<SearchProps, SearchState> {
    constructor(props: SearchProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = { value: '' };
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ value: event.target.value });
        this.props.onChange();
    }

    render() {
        return (
            <div>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            </div>
        );
    }
}