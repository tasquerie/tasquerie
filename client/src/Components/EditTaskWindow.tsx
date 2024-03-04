import React, { Component } from 'react';
import { Task, TaskType } from './Task';

interface EditTaskWindowProps {
    task: TaskType;
    editTask(task: TaskType): void;
    closeBox(): void;
}

interface EditTaskWindowState {
    uid: string;
    name: string;
    isComplete: boolean;
    description: string;
    tags?: string[];
    owner?: string;
    sharedwith?: string[];
}

export class EditTaskWindow extends Component<EditTaskWindowProps, EditTaskWindowState> {
    constructor(props: EditTaskWindowProps) {
        super(props);
        // no state for now
        this.state = {
            uid: this.props.task.uid,
            name: this.props.task.name,
            isComplete: this.props.task.isComplete,
            description: this.props.task.description,
            tags: this.props.task.tags,
            owner: this.props.task.owner,
            sharedwith: this.props.task.sharedwith
        }
    }

    async editTask() {
        // call to modelcontroller
    }

    mockEditTask() {
        let task: TaskType = {
            uid: "AAAAAAAAAAAAA",
            name: this.state.name,
            isComplete: false,
            description: this.state.description,
            creditReward: 5
        }
        this.props.editTask(task);
        this.props.closeBox();
    }

    render() {
        return(
            <div id="editTaskWindow">
                <button onClick={() => {
                    this.props.closeBox();
                }}>
                    X / Cancel
                </button>
                <div>Add New Task</div>
                <textarea
                    onChange={(event) => {
                        this.setState({
                            name: event.target.value
                        });
                    }}
                    id="editTaskName"
                    defaultValue={this.state.name}
                ></textarea>
                <textarea
                    onChange={(event) => {
                        this.setState({
                            name: event.target.value
                        })
                    }}
                    id="editTaskDescription"
                    defaultValue={this.state.description}
                ></textarea>
                <button onClick={() => {
                    let task: TaskType = {
                        uid: "AAAAAAAAAAAAA",
                        name: this.state.name,
                        isComplete: false,
                        description: this.state.description,
                        creditReward: 5
                    }
                    this.props.editTask(task);
                    this.props.closeBox();
                }}>
                    Add Task
                </button>
            </div>
        )
    }
}