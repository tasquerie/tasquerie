import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { stringify } from 'querystring';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import Navbar from './Components/Navbar';
export interface AppState {
  currentPage: string;
  userID: number;
}

class App extends Component<{}, AppState> {
  example: any;

  constructor(props: {}) {
    super(props);
    this.state = {
      currentPage: 'home',
      userID: 0 // You can set this to an initial value as needed
    };
    this.example = 'home';
    // Bind switchState method to the class instance
    this.switchState = this.switchState.bind(this);
  }

  switchState(page: string) {
    this.setState({ currentPage: page });
  }

  render() {
    // Use this.state.currentPage to check the current page
    if (this.state.currentPage === 'home') {
      return (
        <div>
          <Navbar />
          <p>This is the home page</p>
          {/* Button to switch to home page */}
          <button onClick={() => this.switchState('/home')}>
            Go to Home
          </button>
          {/* Button to switch to profile page */}
          <button onClick={() => this.switchState('/profile')}>
            Go to Profile
          </button>
          {/* Button to switch to archive page */}
          <button onClick={() => this.switchState('/archive')}>
            Go to Archive
          </button>
          {/* Button to switch to settings page */}
          <button onClick={() => this.switchState('/settings')}>
            Go to Settings
          </button>
        </div>
      );
    } else if (this.state.currentPage === 'profile') {
      return (
        <div>
          <p>This is the profile page</p>
          {/* Button to switch to home page */}
          <button onClick={() => this.switchState('/home')}>
            Go to Home
          </button>
          {/* Button to switch to profile page */}
          <button onClick={() => this.switchState('/profile')}>
            Go to Profile
          </button>
          {/* Button to switch to archive page */}
          <button onClick={() => this.switchState('/archive')}>
            Go to Archive
          </button>
          {/* Button to switch to settings page */}
          <button onClick={() => this.switchState('/settings')}>
            Go to Settings
          </button>
        </div>
      );
    } else if (this.state.currentPage === 'archive') {
      return (
        <div>
          <p>This is the archive page</p>
          {/* Button to switch to home page */}
          <button onClick={() => this.switchState('/home')}>
            Go to Home
          </button>
          {/* Button to switch to profile page */}
          <button onClick={() => this.switchState('/profile')}>
            Go to Profile
          </button>
          {/* Button to switch to archive page */}
          <button onClick={() => this.switchState('/archive')}>
            Go to Archive
          </button>
          {/* Button to switch to settings page */}
          <button onClick={() => this.switchState('/settings')}>
            Go to Settings
          </button>
        </div>
      );
    } else if (this.state.currentPage === 'settings') {
      return (
        <div>
          <p>This is the settings page</p>
          {/* Button to switch to home page */}
          <button onClick={() => this.switchState('/home')}>
            Go to Home
          </button>
          {/* Button to switch to profile page */}
          <button onClick={() => this.switchState('/profile')}>
            Go to Profile
          </button>
          {/* Button to switch to archive page */}
          <button onClick={() => this.switchState('/archive')}>
            Go to Archive
          </button>
          {/* Button to switch to settings page */}
          <button onClick={() => this.switchState('/settings')}>
            Go to Settings
          </button>
        </div>
      );
    }
  }
}

export default App;
