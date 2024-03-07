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
import '../Components/EggCollection';
import { withAuth } from './../Context/AuthContext';
import {TaskList} from '../Components/TaskList';

// import EggCollection from '../Components/EggCollection';
// import { BackendWrapper } from '../BackendWrapper';
// import AuthContext from '../Context/AuthContext';


interface HomeProps {
    auth: AuthProps;
    // displaytaskFolder(folderName: string): void;
    updateState(selected: string): void;
}

interface AuthProps {
    getUser: any,
    googleSignIn: any,
    signIn: any,
    signUp: any,
    signOut: any
  }

interface HomeState {
    universalCredits: number;
}

class Home extends Component<HomeProps, HomeState> {
    // static contextType = AuthContext;
    // context!: React.ContextType<typeof AuthContext>;

    constructor(props: any) {
        super(props);
        this.state = {
            universalCredits: 0
        }
    }

    async handleSignOut() {
        const { getUser, googleSignIn, signIn, signUp, signOut } = this.props.auth;
        signOut();
        this.props.updateState('login');
    }

    async componentDidMount() {
        await this.loadUniversalCredits();
    }

    async loadUniversalCredits() {
        console.log('loading universal credits');
        let args: Map<string, any> = new Map();
        // args.set("UserID", this.context.getUser());

        try {
            // let user = await BackendWrapper.view("getUserInfo", args);
            this.setState({
                // universalCredits: user.univCredits
            });
        } catch (e) {
            console.log("Failure to get universal credits");
        }
    }

    disableEvent(e: any) {
        e.preventDefault();
    }

    render() {


        return (

            <div className="content flex-v align-content-center">
                <div id='tasquerieTitle'>Tasquerie</div>
                {/* <button onClick={() => {
                    this.handleSignOut();
                })}>Sign Out</button> */}
                <div>
                    <button onClick={() => {
                        this.handleSignOut();
                    }}>Sign Out</button>
                </div>
                <div id='universalCredits'>You have <span>{this.state.universalCredits}</span> universal credits</div>
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

export default withAuth(Home);