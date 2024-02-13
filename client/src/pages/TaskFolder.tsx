
import React, {Component} from 'react';
import logo from './logo.svg';
import {AppState} from '../App';

interface TaskFolderProps {
    updateState(selected: string): void;

}

class TaskFolder extends Component<TaskFolderProps, AppState> {

    constructor(props: any){
        super(props);
        // no state
    }

    render() {
        return (
            <div id="taskFolder">
                <h1>Task Folder</h1>
                <p>Yooo task folder stuff here yay</p>
                <button onClick={() => this.props.updateState('home')}>Back to Home</button>
            </div>
        );
    }
}

export default TaskFolder;