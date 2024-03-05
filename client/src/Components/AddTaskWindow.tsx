import React, { Component } from 'react';
import { Task, TaskType } from './Task';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';

interface AddTaskWindowProps {
    folderName: string;
    closeBox(): void;
}

interface AddTaskWindowState {
    taskName: string;
    taskDescription: string;
}

export class AddTaskWindow extends Component<AddTaskWindowProps, AddTaskWindowState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: AddTaskWindowProps) {
        super(props);
        // no state for now
    }

    async addTask() {
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("folderName", this.props.folderName);
        args.set("taskName", this.state.taskName);
        args.set("description", this.state.taskDescription);
        args.set("tags", []);
        args.set("whoSharedWith", []);

        try {
            await BackendWrapper.controller("addTask", args);
        } catch (e) {
            console.log("Unable to add task");
        }
    }

    render() {
        return(
            <div id="addTaskWindow">
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
                <button onClick={async () => {
                    await this.addTask();
                }}>
                    Add Task
                </button>
            </div>
        )
    }
}