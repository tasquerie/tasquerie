import React, { Component } from 'react';
import Auth from "../Context/Auth"
// import { useAuth, AuthContext } from "../Context/AuthContext";
import AuthContext from '../Context/AuthContext';
import { AlertBox } from '../Components/AlertBox';

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

interface LoginProps {
    updateState(selected: string): void;
}

class Login extends Component<LoginProps, LoginState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;
    // OK SO this is supposed to be "delcare context: [blablabla]" but something something @babel/plugin-transform-typscript
    // so. idk. this is the old way of doing it (TS v. < 3.7) but whatever
    
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

    async validate(): Promise<boolean> {
        // do validation stuff ig
        // returns true if entered username + password is a valid login
        // otherwise returns false
        // let user = await this.props.auth.signIn(this.state.email, this.state.password);
        await this.context.signIn(this.state.email, this.state.password);

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
                            this.submit();
                        }}>Log In</button>
                    <button id="signupButton" className="loginButton"
                        onClick={() => {
                            this.props.updateState('signup');
                        }}
                    >Sign Up</button>
                </div>
            </div>
        )
    }
}

export default Login;