import React, { Component } from 'react';
import { withAuth } from './../Context/AuthContext';

// hard code (kind of) disallowed input characters
// could move this up a layer if we want to share with signup
let legalInputs: string = "abcdefghijklmnopqrstuvwxyz._-1234567890@";
let legalKeys: string[] = [
    'Enter',
    'Backspace'
]

interface SignUpState {
    email: string;
    password: string;
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

class SignUp extends Component<MyComponentProps, SignUpState> {

    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    async validate() {
        const { getUser, googleSignIn, signIn, signUp, signOut } = this.props.auth;

        // do validation stuff ig
        // returns true if entered username + password is a valid login
        // otherwise returns false
        const otuput = await signUp(this.state.email, this.state.password);
        if (otuput) {
          this.props.updateState('home');
        } else {
          console.log('signup failed');
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
        return (
            <div className="content flex-v align-content-center">
                <div id="signUpBox">
                    <button
                        onClick={() => {
                            this.props.updateState('login');
                        }}
                    >Back</button>
                    <div id="signUpTitle">SIGN UP</div>
                    <input id="emailInput" className="signUpInput" placeholder="Email"
                        onChange={(e) => {
                            this.setState({
                                email: e.target.value
                            });
                        }}
                        onKeyDown={(e) => {
                            this.keyPress(e);
                        }}></input>
                    <input id="passwordInput" className="signUpInput" placeholder="Password" type="password"
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
                    <button id="signUpButton" className="signUpButton"
                        onClick={() => {
                            this.validate();
                        }}>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default withAuth(SignUp);