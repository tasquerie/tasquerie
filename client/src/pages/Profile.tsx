import React, { Component } from 'react';
import { AppState } from '../App';
import { withAuth } from './../Context/AuthContext';

interface ProfileProps {
    updateState(selected: string): void;
    name: string;
    id: number;
    profilePhoto?: string; // Making profile photo optional?
    auth: AuthProps;
    updateState(selected: string): void;
}


interface AuthProps {
    getUser: any,
    googleSignIn: any,
    signIn: any,
    signUp: any,
    signOut: any
  }
class Profile extends Component<ProfileProps> {

    // constructor(props: ProfileProps){
    //     super(props);
    // }

    render() {
        const { getUser, googleSignIn, signIn, signUp, signOut } = this.props.auth;
        const { id, profilePhoto, updateState } = this.props;
        const divStyle: React.CSSProperties = {
            position: 'absolute',
            top: '50%',
            left: '45%',
            // transform: 'translate(-50%, -50%)',
            // border: '1px solid black',
            padding: '20px',
            // backgroundColor: 'lightgray'
          };
        const user = getUser();
        const img = user.photoURL;
        const name = user.displayName;
        console.log(img);
        return (
            <div style={divStyle}>
                <h1>Profile</h1>
                {}
                {<img src={img} alt="Profile" />}
                {}
                <p className='step-content'>Name: {name}</p>
                <button onClick={() => updateState('home')}>Back to Home</button>
            </div>
        );
    }
}

export default withAuth(Profile);