
import React, {Component} from 'react';
import '../pages/Settings'
import {AppState} from '../App';
import { Task, TaskType } from '../Components/Task'
import * as mocks from '../Mocks';

export interface HowToProps {
    updateState(selected: string): void;
    title: string;
    description: string;
    showButton?: boolean;
}

class Howto extends Component<HowToProps> {

    constructor(props: any){
        super(props);
        // no state
    }

    render() {
        return (
            <div
            className="step-box">
                <div className="step-content">
                    <h2>{this.props.title}</h2>
                    <p>{this.props.description}</p>
                </div>
            </div>
        );
    }

}

export default Howto;