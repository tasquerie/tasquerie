import React, { Component } from 'react';
import { withAuth } from './../Context/AuthContext';
//import Navbar from "./../Components/Navbar";
// hard code (kind of) disallowed input characters
// could move this up a layer if we want to share with signup

let legalInputs: string = "abcdefghijklmnopqrstuvwxyz._-1234567890";
let legalKeys: string[] = [
    'Enter',
    'Backspace'
]

interface LoginState {
    username: string;
    password: string;
    alertBox:boolean;
}

interface LoginProps {
    updateState(selected: string): void;
}

// class Login extends Component<LoginProps, LoginState> {
    class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleSignIn = async (username:string, password:string) => {
        try {
          // console.log("HER");
          // const username = "tasquerie@gmail.com";
          // const password = "supertask";
          // await signIn(username, password);
          const us = await signIn(username, password);
          console.log(us)
        } catch (err) {
          console.error(err);
        }
    };
    
    handleSignOut = async () => {
        try {
          console.log(getUser());
          await signOut();
        } catch (err) {
          console.error(err);
        }
    };
    
    handleSignUp = async (username:string, password:string) => {
        try {
            // const username = "tasquerie@gmail.com";
            // const password = "supertask";
            await signUp(username, password);

        } catch (err) {
            console.error(err);
        }
    }
    
    handleGoogleSignUp = async () => {
        try {
            await googleSignIn();
        } catch (err) {
            console.error(err);
        }
    }

    validate(): boolean {
        // do validation stuff ig
        // returns true if entered username + password is a valid login
        // otherwise returns false
        return false;
    }

    submit(e: Event): void {
        e.preventDefault();
        // send contents to backend for validation??
        // is validation frontend or backend? who knows
    }

    keyPress(e: any) {
        if(!legalInputs.includes(e.key) && !legalKeys.includes(e.key)) {
            console.log(`illegal input detected ${e.key}`);
            e.preventDefault();
        }
        // if user hits enter, attempt to submit form
    }

    render() {
        return (
            <div className="content flex-v align-content-center">
                <div id="loginBox">
                    <div id="loginTitle">LOG IN</div>
                    <input id="usernameInput" className="loginInput" placeholder="Username"
                        onChange={(e) => {
                            this.setState({
                                username: e.target.value
                            });
                        }}
                        onKeyDown={(e) => {
                            this.keyPress(e);
                        }}></input>
                    <input id="passwordInput" className="loginInput" placeholder="Password" type="password"
                        onChange={(e) => {
                            this.setState({
                                password: e.target.value
                            });
                        }}
                        onKeyDown={(e) => {
                            this.keyPress(e);
                        }}></input>
                    <button id="loginButton" className="loginButton"
                        onClick={(e) => {
                            // googleSignIn();
                            
                            this.handleSignIn(this.state.username, this.state.password);
                            // this.props.updateState('home');
                        }}>Log In</button>
                    <button id="signupButton" className="loginButton"
                    onClick={(e) => {
                        console.log("sign")
                        this.handleSignUp(this.state.username, this.state.password);
                        // this.props.updateState('home');
                    }}>Sign Up</button>
                    <button id="googlesignupButton" className="loginButton"
                    onClick={this.handleGoogleSignUp}>Google login</button>
                </div>
            </div>
        )
    }
}

export default Login;