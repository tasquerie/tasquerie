import React, { Component } from 'react';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';
import { EditTaskWindow } from './EditTaskWindow';

// NOTE: egg image sizes are strictly 256x256. Otherwise things break

export interface TaskType {
    uid: string;
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
    toggleCompletion(): void;
    task: TaskType;
    // task: string; // taskID, call backend to get info
}

interface TaskState {
    showingDetails: boolean;
    uid: string;
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
            creditReward: this.props.task.creditReward,
            uid: this.props.task.uid,
            name: this.props.task.name,
            isComplete: this.props.task.isComplete,
            description: this.props.task.description,
            tags: this.props.task.tags,
            owner: this.props.task.owner,
            sharedwith: this.props.task.sharedwith,
            showingEditWindow: false
        };
    }

    async componentDidMount() {
        // load all of current task's info
        // await this.loadTaskInfo(this.props.task);
    }

    async loadTaskInfo(taskID: string) {
        let args: Map<string, any> = new Map();
        args.set("TaskID", taskID);
        let task = await BackendWrapper.view("getTaskInfo", args);
        // maybe error handling
        // this.setState({
        //     name: task.name,
        //     isComplete: task.isComplete,
        //     description: task.description,
        //     tags: task.tags
        // })
        // check if optional fields exist and handle those
    }

    handleCheck(event: any) {
        if(this.props.task.isComplete){
            // temporarily disallow unchecking
            event.preventDefault();
            // TODO: figure out some way to only check boxes when double clicked
            // and not single clicked. react's double click event also causes
            // two single click events. tragic
        }
        else{
            this.props.toggleCompletion();
        }
    }

    toggleCompletion() {
        
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

    mockEditTask(task: TaskType) {
        // only temporary, no persistence, exists at this level only
        // but proof of concept
        this.setState({
            showingDetails: false,
            creditReward: task.creditReward,
            uid: task.uid,
            name: task.name,
            isComplete: task.isComplete,
            description: task.description,
            tags: task.tags,
            owner: task.owner,
            sharedwith: task.sharedwith
        })
    }

    render() {

        let task, editWindow;

        if (this.state.showingDetails) {
            task = <div>
                        <div className="taskHeader">
                            <input type="checkbox" 
                            onClick={(event) => {
                                this.handleCheck(event);
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
                            onClick={(event) => {
                                this.handleCheck(event);
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
                task={this.props.task}
                editTask={(task) => {
                    this.mockEditTask(task);
                }}
                closeBox={() => {
                    this.hideEditWindow();
                }}
            />
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