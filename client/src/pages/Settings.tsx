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

class Settings extends Component<SettingsProps> {

    constructor(props: any){
        super(props);
    }

    render() {
        return (
            <div id="settings-general">
                <h1>General Settings</h1>
                <button className='home-button invisibleButton fa fa-angle-left' onClick={() => this.props.updateState('home')}> Back to Home</button>
                <button className="settings-button invisibleButton "  onClick={() => this.props.updateState('about')}>
                    <i className="fa fa-info" aria-hidden="true"></i>   About
                </button>
                <button className=" settings-button invisibleButton" onClick={() => this.props.updateState('howto')}>  
                    <i className="fa fa-question-circle-o" aria-hidden="true"></i>  How To
                </button>
            </div>
        );
    }
}

export default Settings;