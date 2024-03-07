import React, { Component } from 'react';
import { Task, TaskType } from './Task';

interface AddTaskWindowProps {
    addTask(task:TaskType): void;
    closeBox(): void;
    visible: string;
}

interface AddTaskWindowState {
    taskName: string;
    taskDescription: string;
    taskComplete:boolean;
    taskStartDate:string;
    taskEndDate:string;
}

export class AddTaskWindow extends Component<AddTaskWindowProps, AddTaskWindowState> {
    constructor(props: AddTaskWindowProps) {
        super(props);
        // no state for now
        this.state = {
            taskName: "",
            taskDescription:"",
            taskComplete :false,
            taskStartDate:"",
            taskEndDate:""
        }
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
                <label>
                    Check if Completed
                    <input
                    type = "checkbox"
                    checked={this.state.taskComplete}
                    onChange={() => {
                        this.setState(prevState =>  ({
                            taskComplete: !prevState.taskComplete
                        }))
                    }}
                    id="addTaskComplete"
                    placeholder="Task Complete"
                /></label>
                <textarea
                    onChange={(event) => {
                        this.setState({
                            taskStartDate: event.target.value
                        })
                    }}
                    id="addTaskStartDate"
                    placeholder="Task Start Date"
                ></textarea>
                <textarea
                    onChange={(event) => {
                        this.setState({
                            taskEndDate: event.target.value
                        })
                    }}
                    id="addTaskEndDate"
                    placeholder="Task End Date"
                ></textarea>
                <button onClick={() => {
                    let task: TaskType = {
                        name: this.state.taskName,
                        description: this.state.taskDescription,
                        isComplete: this.state.taskComplete,
                        startDate: this.state.taskStartDate,
                        endDate:this.state.taskEndDate
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