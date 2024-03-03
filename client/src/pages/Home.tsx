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
import '../Components/EggCollection';
import TaskCollection from '../Components/EggCollection';
import EggCollection from '../Components/EggCollection';
import * as mocks from '../Mocks'
import { AddEggWindow } from '../Components/AddEggWindow';
import { BackendWrapper } from '../BackendWrapper';
import AuthContext from '../Context/AuthContext';


interface HomeProps {
    displaytaskFolder(eggId: number): void;
    updateState(selected: string): void;
}

interface HomeState {
    // who knows
}

class Home extends Component<HomeProps, HomeState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;
    
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        // backend fetch testing will have to come later - backend is inexplicably broken
        // let funcArgs: Map<string, any> = new Map();
        // funcArgs.set("UserID", this.context.getUser());
        // console.log(BackendWrapper.view("getUserInfo", funcArgs));
        // funcArgs.set("folderName", "test");
        // console.log(BackendWrapper.view("getTaskFolderInfo", funcArgs));
        return (
            <div className="content flex-v align-content-center">
                <div id='tasquerieTitle'>Tasquerie</div>
                <div id='universalCredits'>You have <span>{mocks.universalCredits}</span> universal credits</div>
                {/* <p>A brief description of Tasquerie goes here...</p> */}
                {/* <UpcomingTasks tasks={this.state.tasks} /> */}
                {/* <TaskCollection tasks={this.state.tasks} /> */}
                {/* <p>This is the home page</p> */}
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
                <EggCollection displayTaskFolder={this.props.displaytaskFolder}/>
            </div>
        );
    }
}

export default Home;
