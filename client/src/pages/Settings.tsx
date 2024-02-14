// There are two sections in general settings:
// Settings
// Archived Eggs
// Top level settings should be accessible in the Settings section. Archived 
// eggs should be viewable in the Archived Eggs section.c
// There should be a component that when clicked shows the Egg Library.

import React, {Component} from 'react';
import logo from './logo.svg';
import {AppState} from '../App';

interface SettingsProps {
    updateState(selected: string): void;
}

class Settings extends Component<SettingsProps, AppState> {

    constructor(props: any){
        super(props);
        // no state
    }

    render() {
        return (
            <div id="settings-general">
                <h1>General Settings</h1>
                <button className='home-button invisibleButton' onClick={() => this.props.updateState('home')}>Back to Home</button>
                <button className="settings-button invisibleButton" onClick={() => this.props.updateState('about')}>About</button>
                <button className="settings-button invisibleButton" onClick={() => this.props.updateState('howto')}>How To</button>
            </div>
        );
    }
}

export default Settings;