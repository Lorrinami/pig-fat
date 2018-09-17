import React, {Component} from 'react';
import fetch from "node-fetch";

const withData = url => Component => {
    return class extends Component {
        constructor(props) {
            super(props)

            this.state = {data: []}
        }

        componentDidMount() {
            fetch(url).then(response => response).then(data => this.setState({data}))
        }

        render() {
            return <Component {...this.props} {...this.state}/>
        }
    }
}

const List =({data:gists}) => (
    <ul>
        {this.state.gists.map(gist => {
            <li key={gist.id}>{gist.description}</li>
        })}
    </ul>
)



class Gists extends Component {
    constructor(props) {
        super(props)

        this.state = {gists: []}
    }

    componentDidMount() {
        fetch('https://api.github.com/users/gaearon/gists')
            .then(response => response.json())
            .then(gists => this.setState({gists}))
    }

    render() {
        return (
            <ul>
                {this.state.gists.map(gist => {
                    <li key={gist.id}>{gist.description}</li>
                })}
            </ul>
        )
    }
}