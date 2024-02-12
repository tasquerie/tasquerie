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
import { Egg } from '../Components/Egg';
import { tempEgg } from '../App';


interface HomeProps {
    updateState(selected: string): void;
}

class Home extends Component<HomeProps> {
    
    constructor(props: any) {
        super(props);
        // no state for now
    }

    render() {
        return (
            <div className="content">
                <h1>Welcome to Tasquerie</h1>
                <p>A brief description of Tasquerie goes here...</p>
                {/* <UpcomingTasks tasks={this.state.tasks} /> */}
                {/* <TaskCollection tasks={this.state.tasks} /> */}
                <p>This is the home page</p>
                {/* Button to switch to profile page */}
                <button onClick={() => this.props.updateState('profile')}>
                    Go to Profile
                </button>
                {/* Button to switch to archive page */}
                <button onClick={() => this.props.updateState('archive')}>
                    Go to Archive
                </button>
                {/* Button to switch to settings page */}
                <button onClick={() => this.props.updateState('settings')}>
                    Go to Settings
                </button>
                {/* <div id="eggContainer">
                    <Egg
                    imgUrl={tempEgg.imgUrl}
                    activeAccessories={tempEgg.activeAccessories}
                    ></Egg>
                </div> */}
            </div>
        );
    }
}

export default Home;
