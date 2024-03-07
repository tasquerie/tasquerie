import React, { Component } from 'react';
import { withAuth } from './../Context/AuthContext';
import Navbar from "./../Components/Navbar";
import { AlertBox } from '../Components/AlertBox';
import { GoogleLoginButton } from "react-social-login-buttons";

// hard code (kind of) disallowed input characters
// could move this up a layer if we want to share with signup
let legalInputs: string = "abcdefghijklmnopqrstuvwxyz._-1234567890@";
let legalKeys: string[] = [
    'Enter',
    'Backspace'
]

interface LoginState {
    email: string;
    password: string;
    showingAlertBox: boolean
}

interface AuthProps {
    getUser: any,
    googleSignIn: any,
    signIn: any,
    signUp: any,
    signOut: any
  }

interface MyComponentProps {
    auth: AuthProps;
    updateState(selected: string): void;
  }

// class Login extends Component<LoginProps, LoginState> {
    class Login extends Component<MyComponentProps, LoginState> {
        constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showingAlertBox: false
        }
    }

    showAlert() {
        this.setState({
          showingAlertBox: true
        });
    }

    hideAlert() {
        this.setState({
          showingAlertBox: false
        });
    }

    // async submit() {
    //     // send contents to backend for validation??
    //     // is validation frontend or backend? who knows
    //     let status = await this.validate();

    //     if (status) {
    //         // let user in
    //         this.props.updateState('home');
    //     } else {
    //         // tell user they're wrong
    //         console.log('login failed');
    //         this.showAlert();
    //     }
    // }

    async validate() {
        const { getUser, googleSignIn, signIn, signUp, signOut } = this.props.auth;
        // do validation stuff ig
        // returns true if entered username + password is a valid login
        // otherwise returns false
        // let user = await this.props.auth.signIn(this.state.email, this.state.password);
        const result = await signIn(this.state.email, this.state.password);
        if (result) {
            this.props.updateState('home');
        } else {
            console.log('login failed');
            this.showAlert();
        }

    }

    async googleValidate() {
        const { getUser, googleSignIn, signIn, signUp, signOut } = this.props.auth;
        const result = await googleSignIn();
        if (result) {
            this.props.updateState('home');
    } else {
        console.log('login failed');
        this.showAlert();
    }
    }

    keyPress(e: any) {
        if(!legalInputs.includes(e.key) && !legalKeys.includes(e.key)) {
            console.log(`illegal input detected ${e.key}`);
            e.preventDefault();
        }
        // if user hits enter, attempt to submit form
    }

    disableEvent(e: any) {
        e.preventDefault();
    }

    render() {
        let alert;
        if (this.state.showingAlertBox) {
            alert = <AlertBox
                close={() => {
                    this.hideAlert();
                }}
                title="Log In Failed"
                message="Check to make sure email and password are correct."/>;
        } else {
            alert = '';
        }
        return (
            <div className="content flex-v align-content-center">
                {alert}
                <div id="loginBox">
                    <div id="loginTitle">LOG IN</div>
                    <input id="emailInput" className="loginInput" placeholder="Email"
                        onChange={(e) => {
                            this.setState({
                                email: e.target.value
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
                        }}
                        onCopy={(e) => {
                            this.disableEvent(e);
                        }}
                        ></input>
                    <button id="loginButton" className="loginButton"
                        onClick={() => {
                            this.validate();
                        }}>Log In</button>
                    <button id="signupButton" className="loginButton"
                        onClick={() => {
                            this.props.updateState('signup');
                        }}
                    >Sign Up</button>
                    <button onClick={() => {
                        this.googleValidate();
                    }}>Google Sign in</button>
                </div>
            </div>
        )
    }

}

export default withAuth(Login);