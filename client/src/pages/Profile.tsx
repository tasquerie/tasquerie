
import React, {Component} from 'react';
import logo from './logo.svg';
import {AppState} from '../App';

interface ProfileProps {
    updateState(selected: string): void;
}

class Profile extends Component<ProfileProps> {

    constructor(props: ProfileProps){
        super(props);
        // no state
    }

    render() {
        return (
            <div id="profile">
                <h1>Profile</h1>
                <p>Yooo profile stuff here yay</p>
                <button onClick={() => this.props.updateState('home')}>Back to Home</button>
            </div>
        );
    }
}

export default Profile