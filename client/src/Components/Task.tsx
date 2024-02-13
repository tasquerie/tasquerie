import React, { Component } from 'react';

// NOTE: egg image sizes are strictly 256x256. Otherwise things break

export interface TaskType {
    name: string;
    isComplete: boolean;
    description: string;
    // bare essentials for now
    /**
     * to add: tags, owner, sharedwith, startdate, cycleduration, deadline
     */
}

interface TaskProps {
    toggleCompletion(): void;
    task: TaskType
}

export class Task extends Component<TaskProps> {
    constructor(props: TaskProps){
        super(props);
    }

    render() {

        return(
            <div className="task">
                <div className="taskHeader">
                    <input type="checkbox" 
                    onChange={() => this.props.toggleCompletion()}
                    defaultChecked={this.props.task.isComplete}/>
                    <div className="taskName">{this.props.task.name}</div>
                </div>
                <div className="taskBody">
                    {this.props.task.description}
                </div>
            </div>
        )
    }
}