import React, { Component } from 'react';

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
}

interface LoginProps {
    updateState(selected: string): void;
}

class Login extends Component<LoginProps, LoginState> {
    
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            password: ''
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
                            this.props.updateState('home');
                        }}>Log In</button>
                    <button id="signupButton" className="loginButton"
                    >Sign Up</button>
                    <button>
                        Placeholder for Google Auth or whatever 3rd party thing we're using
                    </button>
                </div>
            </div>
        )
    }
}

export default Login;