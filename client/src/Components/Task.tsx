import React, { Component } from 'react';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';
import { EditTaskWindow } from './EditTaskWindow';

// NOTE: egg image sizes are strictly 256x256. Otherwise things break

export interface TaskType {
    taskID: string;
    name: string;
    isComplete: boolean;
    description: string;
    tags?: string[];
    owner?: string;
    sharedwith?: string[];
    // cycleDuration?: Duration??? Date?? Time? typescript surely has some type for this
    // deadline?: Date
    // bare essentials for now
    /**
     * to add: tags, owner, sharedwith, startdate, cycleduration, deadline
     */
    creditReward: number;
}

interface TaskProps {
    folderName: string;
    // task: TaskType;
    taskID: string; // taskID, call backend to get info
}

export interface TaskState {
    showingDetails: boolean;
    taskID: string;
    name: string;
    isComplete: boolean;
    description: string;
    tags?: string[];
    owner?: string;
    sharedwith?: string[];
    creditReward: number;
    showingEditWindow: boolean;
}

export class Task extends Component<TaskProps, TaskState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: TaskProps){
        super(props);
        this.state = {
            showingDetails: false,
            creditReward: 5, // must hard code this, unfortunately
                            // nothing in backend stores amount of credits
                            // rewarded for a task
            taskID: this.props.taskID,
            name: '',
            isComplete: false,
            description: '',
            tags: [],
            owner: '',
            sharedwith: [],
            showingEditWindow: false
        };
    }

    async componentDidMount() {
        // load all of current task's info before rendering
        await this.loadTaskInfo(this.props.taskID);
    }

    async loadTaskInfo(taskID: string) {
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("TaskID", taskID);
        let task = await BackendWrapper.view("getTaskInfo", args);
        // maybe error handling
        this.setState({
            name: task.name,
            isComplete: task.isComplete,
            description: task.description
            // ignoring tags, owner, and shares rn
        });
        // check if optional fields exist and handle those
    }

    async handleCheck(event: any) {
        if(this.state.isComplete){
            // disallow unchecking
            // if you check off a task - you're DONE. no going back
            event.preventDefault();
            // TODO: figure out some way to only check boxes when double clicked
            // and not single clicked. react's double click event also causes
            // two single click events. tragic
        }
        else{
            await this.toggleCompletion();
        }
    }

    async toggleCompletion() {
        // mark task as complete
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("isComplete", true);
        try {
            await BackendWrapper.controller("setTask", args);
        } catch (e) {
            // shouldn't happen
            console.log("Failure to mark task as completed");
        }

        // award credits to user
        args.delete("isComplete");
        args.set("folderName", this.props.folderName);
        args.set("amount", this.state.creditReward);
        try {
            await BackendWrapper.controller("addEggCredits", args);
        } catch (e) {
            console.log("Failure to award egg specific credits");
        }
    }

    toggleDetail() {
        this.setState(prevState => ({
            showingDetails: !prevState.showingDetails
        }))
    }

    showEditWindow() {
        this.setState({
            showingEditWindow: true
        });
    }

    hideEditWindow() {
        this.setState({
            showingEditWindow: false
        });
    }

    async deleteTask() {
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("folderName", this.props.folderName);
        args.set("TaskID", this.state.taskID);
        BackendWrapper.controller("deleteTask", args);
    }

    render() {

        let task, editWindow;

        if (this.state.showingDetails) {
            task = <div>
                        <div className="taskHeader">
                            <input type="checkbox" 
                            onClick={async (event) => {
                                await this.handleCheck(event);
                            }}
                            defaultChecked={this.state.isComplete}/>
                            <div className="taskName"
                            onClick={() => {
                                this.toggleDetail();
                            }}
                            >{this.state.name}</div>
                            <button className="editTaskButton"
                            onClick={() => {
                                this.showEditWindow();
                            }}
                            >Edit</button>
                        </div>
                        <div className="taskBody">
                            {this.state.description}
                        </div>
                    </div>;
        } else {
            task = <div>
                        <div className="taskHeader">
                            <input type="checkbox" 
                            onClick={async (event) => {
                                await this.handleCheck(event);
                            }}
                            defaultChecked={this.state.isComplete}/>
                            <div className="taskName"
                            onClick={() => {
                                this.toggleDetail();
                            }}
                            >{this.state.name}</div>
                            <button className="editTaskButton"
                            onClick={() => {
                                this.showEditWindow();
                            }}
                            >Edit</button>
                        </div>
                    </div>;
        }

        if (this.state.showingEditWindow) {
            editWindow = <EditTaskWindow
                task={this.state}
                taskID={this.props.taskID}
                closeBox={() => {
                    this.hideEditWindow();
                }}
                deleteTask={async () => {
                    await this.deleteTask();
                }}
            />;
            task = '';
        } else {
            editWindow = '';
        }

        return(
            <div className="task">
                {editWindow}
                {task}
            </div>
        )
    }
}