
import React, {Component} from 'react';
import '../pages/Settings'
import logo from './logo.svg';
import {AppState} from '../App';
import { Task, TaskType } from '../Components/Task'
import * as mocks from '../Mocks';

interface SettingsProps {
    updateState(selected: string): void;
}

class About extends Component<SettingsProps> {

    constructor(props: any){
        super(props);
    }

    render() {
        return (
            <div>
                <h1 className='color-settings'>About</h1>
                <p className='color-settings'>Tasquerie is a novel task management web app that provides to users all of the standard productivity app functions at their fingertips, with additional game-like features that make staying motivated and incentivised to complete their tasks.

The web app presents itself as a website interface that the user can log in to and see their collections of tasks, organised in a file-system-like way, such that each larger task can have several smaller tasks beneath it, which may also have smaller tasks too. Tasks can be customised with flexible descriptions that allow users to use markdown to add emphasis and links where needed. They can also use tags to quickly organise their tasks and filter them based on their needs. Tasquerie also allows for shared tasks - with shared tasks, users can keep each other accountable for completing parts of a larger task.

The game element is that every large task at the top level is associated with an egg, which the user can nurture and grow, and eventually hatch. Tasquerie offers a wide variety of eggs with various designs that require different amounts of effort; this, combined with the introduction of streaks and additional achievement rewards, incentivises users to keep on track and on time with the tasks they have set themselves. Users complete tasks to gain tokens, which they can use to purchase interactions or accessories for their creatures.</p>
                <button onClick={() => this.props.updateState('settings')}>Back to Settings</button>
            </div>
        );
    }
}

export default About;