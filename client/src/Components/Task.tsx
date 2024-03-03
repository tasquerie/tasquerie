import React, { Component } from 'react';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';

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
    // uid: string;
    // name: string;
    // isComplete: boolean;
    // description: string;
    // tags?: string[];
    // owner?: string;
    // sharedwith?: string[];
    creditReward: number;
}

export class Task extends Component<TaskProps, TaskState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: TaskProps){
        super(props);
        this.state = {
            showingDetails: false,
            creditReward: this.props.task.creditReward
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

    render() {

        let task;

        if (this.state.showingDetails) {
            task = <div>
                        <div className="taskHeader">
                            <input type="checkbox" 
                            onClick={(event) => {
                                this.handleCheck(event);
                            }}
                            defaultChecked={this.props.task.isComplete}/>
                            <div className="taskName"
                            onClick={() => {
                                this.toggleDetail();
                            }}
                            >{this.props.task.name}</div>
                            <button className="editTaskButton">Edit</button>
                        </div>
                        <div className="taskBody">
                            {this.props.task.description}
                        </div>
                    </div>;
        } else {
            task = <div>
                        <div className="taskHeader">
                            <input type="checkbox" 
                            onClick={(event) => {
                                this.handleCheck(event);
                            }}
                            defaultChecked={this.props.task.isComplete}/>
                            <div className="taskName"
                            onClick={() => {
                                this.toggleDetail();
                            }}
                            >{this.props.task.name}</div>
                            <button className="editTaskButton">Edit</button>
                        </div>
                    </div>;
        }

        return(
            <div className="task">
                {task}
            </div>
        )
    }
}