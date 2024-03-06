import React, { Component } from 'react';
import TestAuthContext from '../Context/AuthContext';

import Auth from "../Context/Auth"

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

interface SignUpProps {
    updateState(selected: string): void;
}

class SignUp extends Component<SignUpProps, SignUpState> {
    static contextType = TestAuthContext;
    context!: React.ContextType<typeof TestAuthContext>;
    
    constructor(props: any) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    async validate(): Promise<boolean> {
        // do validation stuff ig
        // returns true if entered username + password is a valid login
        // otherwise returns false
        await this.context.signUp(this.state.email, this.state.password);

        if (this.context.getUser() === '') {
            // do something ig
            return false;
        }

        return true;
    }

    async submit() {
        // send contents to backend for validation??
        // is validation frontend or backend? who knows
        let status = await this.validate();

        if (status) {
            // let user in
            this.props.updateState('home');
        } else {
            // tell user they're wrong
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
                            this.submit();
                        }}>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default SignUp;