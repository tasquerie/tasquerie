// The Home Page is what the user sees upon login. It is the topmost level
// of functionality, and should contain four things in some way:
// Collection of Eggs
// Upcoming Tasks
// General Settings
// General Achievements/Streaks
// Task Basket

// Additionally, somewhere on the screen the user should be able to see how
// many Universal Credits they have.

import React, { Component } from 'react';
import UpcomingTasks from '../Components/UpcomingTasks';
import {TaskList} from '../Components/TaskList'
// import '../Components/EggCollection';
// import * as mocks from '../Mocks'


interface HomeProps {
    displayTaskFolder(folderName:string):void;
    updateState(selected: string): void;
}

class Home extends Component<HomeProps> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="content flex-v align-content-center">
                <div id='tasquerieTitle'>Tasquerie</div>
                {/* <div id='universalCredits'>You have <span>{mocks.universalCredits}</span> universal credits</div> */}
                <p>A brief description of Tasquerie goes here...</p>
                {/* <UpcomingTasks tasks={this.state.tasks} /> */}
                {/* <TaskCollection tasks={this.state.tasks} /> */}
                <p>This is the home page</p>
                {/* Button to switch to profile page */}
                <div id='homeSidebar'>
                    <button className="invisibleButton homeSidebarButton" onClick={() => this.props.updateState('profile')}>
                        <i className="fa fa-user" aria-hidden="true"></i>
                    </button>
                    {/* Button to switch to archive page */}
                    <button className="invisibleButton homeSidebarButton" onClick={() => this.props.updateState('archive')}>
                        <i className="fa fa-archive" aria-hidden="true"></i>
                    </button>
                    {/* Button to switch to settings page */}
                    <button  className="invisibleButton homeSidebarButton"onClick={() => this.props.updateState('settings')}>
                        <i className="fa fa-cog" aria-hidden="true"></i>
                    </button>
                </div>
                <TaskList/>
            </div>

        );
    }
}

export default Home;
