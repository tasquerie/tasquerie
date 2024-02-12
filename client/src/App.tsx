import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { stringify } from 'querystring';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Archive from './pages/Archive';
import Settings from './pages/Settings';

///// MOCKS /////
export let tempEgg: any = {
  imgUrl: "https://d2bzx2vuetkzse.cloudfront.net/unshoppable_producs/0531b2f0-6899-4a27-82e6-c47e98b14494.jpeg",
  activeAccessories: [
    {
      name: 'hat',
      imgUrl: 'https://media.discordapp.net/attachments/874365985002500126/1206479114123354112/top_hat.png?ex=65dc283c&is=65c9b33c&hm=99d4d8914a985a986f2f608fba758a5763c454ecb3fb95e4a519ddb6a6f3fe78&=&format=webp&quality=lossless&width=337&height=337',
      location: [-10,15],
      scale: 1
    }
  ]
}

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
          <Home updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
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
