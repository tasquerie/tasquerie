import React, { Component } from 'react';
import { Task, TaskType } from './Task';

interface AddTaskCardProps {
}

interface AddTaskCardState {

}

export class AddTaskCard extends Component<AddTaskCardProps, AddTaskCardState> {
    constructor(props: AddTaskCardProps) {
        super(props);
        // no state for now
    }

    render() {
        return(
            <div className="card">
                <div id="addTask">
                    +
                </div>
            </div>
        )
    }
}