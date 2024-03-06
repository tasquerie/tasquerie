
import React, {Component} from 'react';
import '../pages/Settings'
import logo from './logo.svg';
import {AppState} from '../App';
import { Task, TaskType } from '../Components/Task'
import * as mocks from '../Mocks';

interface SettingsProps {
    updateState(selected: string): void;
}

class About extends Component<SettingsProps> {

    constructor(props: any){
        super(props);
    }

    render() {
        return (
            <div>
                <h1 className='color-settings'>About</h1>
                <p className='color-settings'>Tasquerie is a novel task management web app that provides to users all of the standard productivity 
                    app functions at their fingertips, with additional game-like features that make staying motivated and 
                    incentivised to complete their tasks.</p>
                <button onClick={() => this.props.updateState('settings')}>Back to Settings</button>
            </div>
        );
    }
}

export default About;