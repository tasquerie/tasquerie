// There are two sections in general settings:
// Settings
// Archived Eggs
// Top level settings should be accessible in the Settings section. Archived 
// eggs should be viewable in the Archived Eggs section.
// There should be a component that when clicked shows the Egg Library.

import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {AppState} from '../App';

class Settings extends Component<{}, AppState > {
    render() {

        return (
            <p> Settings </p>
        );
    }
}

export default Settings