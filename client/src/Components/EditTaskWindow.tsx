import React, { Component } from 'react';
import { TaskState, TaskType } from './Task';
import { BackendWrapper } from '../BackendWrapper';
import AuthContext from '../Context/AuthContext';

interface EditTaskWindowProps {
    task: TaskState;
    taskID: string;
    closeBox(): void;
    deleteTask(): void;
}

interface EditTaskWindowState {
    name: string;
    isComplete: boolean;
    description: string;
    tags?: string[];
    owner?: string;
    sharedwith?: string[];
}

export class EditTaskWindow extends Component<EditTaskWindowProps, EditTaskWindowState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: EditTaskWindowProps) {
        super(props);
        // no state for now
        this.state = {
            name: this.props.task.name,
            isComplete: this.props.task.isComplete,
            description: this.props.task.description,
            tags: this.props.task.tags,
            owner: this.props.task.owner,
            sharedwith: this.props.task.sharedwith
        }
    }

    async editTask() {
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("taskName", this.state.name);
        args.set("description", this.state.description);
        try {
            await BackendWrapper.controller("setTask", args);
        } catch (e) {
            // uhm.
            // shouldn't happen - if user is logged in, their ID should be valid
            // but if this errors for some reason, don't modify the task and uhh
            // do nothing
            console.log("Failure to edit task.");
        }
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
                            description: event.target.value
                        })
                    }}
                    id="editTaskDescription"
                    defaultValue={this.state.description}
                ></textarea>
                <button onClick={() => {
                    this.editTask();
                }}>
                    Edit Task
                </button>
                <button onClick={() => {
                    this.props.deleteTask();
                }}>
                    Delete Task
                </button>
            </div>
        )
    }
}