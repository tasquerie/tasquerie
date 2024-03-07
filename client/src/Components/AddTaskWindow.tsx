import React, { Component } from 'react';
import { Task, TaskType } from './Task';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';
import Axios from 'axios';

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

        try {
            await BackendWrapper.controller("addTask", args);
        } catch (e) {
            console.log("Unable to add task");
        }
    }

    async addTasktest() {
        // generate new task id
        // create new task object
        // addtask
        // get tasklist from user obj
        // append id to tasklist
        // user updatefield
        let taskID = Math.random().toString(36).slice(2, 12);
        let taskData = {
            taskID: {
                uniqueID: taskID,
                name: this.state.taskName,
                description: this.state.taskDescription,
                isComplete: false
            }
        }
        await Axios.post(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/task/addTask?userID=${this.context.getUser()}&taskData=${taskData}`);

        let response = await Axios.get(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/get?userID=${this.context.getUser()}`);
        let user = response.data;
        let taskFolders = user.taskFolders;
        taskFolders[this.props.folderName].taskIDtoTasks[taskID] = taskData;

        await Axios.patch(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/updateField?userID=${this.context.getUser()}&fieldName=taskFolders&fieldValue=${taskFolders}`)

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