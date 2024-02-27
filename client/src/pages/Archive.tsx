
import React, {Component} from 'react';
import logo from './logo.svg';
import {AppState} from '../App';
import '../Components/EggCollection';

interface ArchiveProps {
    updateState(selected: string): void;
}

class Archive extends Component<ArchiveProps, AppState> {

    constructor(props: any){
        super(props);
        // no state
    }

    render() {
        return (
            <div id="profile">
                <h1>Archive</h1>
                <p>Yooo archive stuff here yay</p>
                <button onClick={() => this.props.updateState('home')}>Back to Home</button>
            </div>
        );
    }
}

export default Archive;