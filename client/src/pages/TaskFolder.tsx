
import React, {Component} from 'react';
import logo from './logo.svg';
import {AppState} from '../App';
import { Task, TaskType } from '../Components/Task'
import * as mocks from '../Mocks';

interface TaskFolderProps {
    updateState(selected: string): void;
    addTask(task: TaskType): void;
    eggId: number;
}

class TaskFolder extends Component<TaskFolderProps> {

    constructor(props: any){
        super(props);
        // no state
    }

    toggleCompletion(taskId: number) {
        mocks.tasksList[this.props.eggId][taskId].isComplete = !(mocks.tasksList[this.props.eggId][taskId].isComplete);
    }

    render() {
        let tasks = [];
        for(let i = 0; i < mocks.tasksList[this.props.eggId].length; i++) {
            let task: TaskType = mocks.tasksList[this.props.eggId][i];
            tasks.push(
                <Task
                    toggleCompletion={() => this.toggleCompletion(i)}
                    task={task}
                />
            );
        }
        return (
            <div id="taskFolder">
                <h1>Task Folder: EGG {this.props.eggId}</h1>
                <p>Yooo task folder stuff here yay</p>
                <button onClick={() => this.props.updateState('home')}>Back to Home</button>
                {tasks}
            </div>
        );
    }
}

export default TaskFolder;