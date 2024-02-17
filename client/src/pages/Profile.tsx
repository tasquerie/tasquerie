import React, { Component } from 'react';
import logo from './logo.svg';
import { AppState } from '../App';

interface ProfileProps {
    updateState(selected: string): void;
    name: string;
    id: number;
    profilePhoto?: string; // Making profile photo optional?
}

class Profile extends Component<ProfileProps> {

    constructor(props: ProfileProps){
        super(props);
    }

    render() {
        const { name, id, profilePhoto, updateState } = this.props;
        return (
            <div id="profile">
                <h1>Profile</h1>
                {}
                {profilePhoto && <img src={profilePhoto} alt="Profile" />}
                {}
                <p className='step-content'>Name: {name}</p>
                <p>ID: {id}</p>
                <button onClick={() => updateState('home')}>Back to Home</button>
            </div>
        );
    }
}

export default Profile;