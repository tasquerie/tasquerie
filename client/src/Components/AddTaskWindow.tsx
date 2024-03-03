import React, { Component } from 'react';
import { Task, TaskType } from './Task';

interface AddTaskWindowProps {
    addTask(task: TaskType): void;
    closeBox(): void;
    visible: string;
}

interface AddTaskWindowState {
    taskName: string;
    taskDescription: string;
}

export class AddTaskWindow extends Component<AddTaskWindowProps, AddTaskWindowState> {
    constructor(props: AddTaskWindowProps) {
        super(props);
        // no state for now
    }

    render() {
        return(
            <div id="addTaskWindow" className={this.props.visible}>
                <button onClick={() => {
                    this.props.closeBox();
                }}>
                    X / Cancel
                </button>
                <div>Add New Task</div>
                <textarea
                    onChange={(event) => {
                        this.setState({
                            taskName: event.target.value
                        });
                    }}
                    id="addTaskName"
                    placeholder="Task Name"
                ></textarea>
                <textarea
                    onChange={(event) => {
                        this.setState({
                            taskDescription: event.target.value
                        })
                    }}
                    id="addTaskDescription"
                    placeholder="Task Description"
                ></textarea>
                <button onClick={() => {
                    let task: TaskType = {
                        uid: "AAAAAAAAAAAAA",
                        name: this.state.taskName,
                        isComplete: false,
                        description: this.state.taskDescription,
                        creditReward: 5
                    }
                    this.props.addTask(task);
                    this.props.closeBox();
                }}>
                    Add Task
                </button>
            </div>
        )
    }
}