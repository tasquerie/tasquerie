import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { stringify } from 'querystring';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Archive from './pages/Archive';
import Settings from './pages/Settings';

///// MOCKS /////
let tempEgg1: any = {
  imgUrls: [
    "https://media.discordapp.net/attachments/874365985002500126/1206833440511492096/egg1.png?ex=65dd723a&is=65cafd3a&hm=5a186ab84f24c59d4dba3dc11fd0543426aec4aada210b014874175902ef2172&=&format=webp&quality=lossless&width=192&height=192",
    "https://media.discordapp.net/attachments/874365985002500126/1206833440800903168/egg1-1.png?ex=65dd723a&is=65cafd3a&hm=76c091b3fa80ab77edf9b66c7304c30481d8dffbb44ef96edef237a62e9d9e54&=&format=webp&quality=lossless&width=192&height=192"
  ],
  stage: 1,
  activeAccessories: []
}

let tempEgg2: any = {
  imgUrls: ["https://media.discordapp.net/attachments/874365985002500126/1206835872402509844/temp.png?ex=65dd747d&is=65caff7d&hm=8f742fda557eab2a77f092a56ad68174e62b778b54d0b25fc32064c92019437f&=&format=webp&quality=lossless&width=192&height=192"],
  stage: 0,
  activeAccessories: []
}

let tempEgg3: any = {
  imgUrls: [
    "https://media.discordapp.net/attachments/874365985002500126/1206835872666746910/temp2.png?ex=65dd747d&is=65caff7d&hm=f4332c795083058c0abe07ff3b8d20eec95c8c9da729d9c1c671132ef6fe225c&=&format=webp&quality=lossless&width=192&height=192"
  ],
  stage: 0,
  activeAccessories: []
}

let tempEgg4: any = {
  imgUrls: [
    "https://media.discordapp.net/attachments/874365985002500126/1206835872910155816/temp3.png?ex=65dd747e&is=65caff7e&hm=3de49c07a480cf53648718cea8fff1ceebc45c7f83c4575fdaebe7850be6c58b&=&format=webp&quality=lossless&width=192&height=192"
  ],
  stage: 0,
  activeAccessories: []
}

export let allEggs: any[] = [tempEgg1, tempEgg2, tempEgg3, tempEgg4]
export let folderNames: string[] = ['CSE403', 'Other Class']
export let eggCollection: any[] = [tempEgg1, tempEgg2]

export interface AppState {
  currentPage: string;
  userID: number;
  displayingEggId: number;
}

class App extends Component<{}, AppState> {
  example: any;

  constructor(props: {}) {
    super(props);
    this.state = {
      currentPage: 'home',
      userID: 0, // You can set this to an initial value as needed
      displayingEggId: -1
    };
    this.example = 'home';
    // Bind switchState method to the class instance
    this.switchState = this.switchState.bind(this);
  }

  switchState(page: string) {
    this.setState({ currentPage: page });
  }

  displayTaskFolder(eggId: number) {
    // if id >= 0, display a page
    // id = -1 means no egg is being displayed
    this.setState({displayingEggId : eggId});
  }

  render() {
    // Use this.state.currentPage to check the current page
    if (this.state.currentPage === 'home') {
      return (
        <div>
          <Home 
          displaytaskFolder={
            (eggId: number) => {
              this.displayTaskFolder(eggId);
            }
          }
          updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.switchState(selected);
            }
          }/>
        </div>
      );
    } else if (this.state.currentPage === 'profile') {
      return (
        <div>
          <Profile updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>
      );
    } else if (this.state.currentPage === 'archive') {
      return (
        <div>
          <Archive updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>
      );
    } else if (this.state.currentPage === 'settings') {
      return (
        <div>
          <Settings updateState={
            (selected: string) => {
              console.log(`switch page to ${selected}`);
              this.setState({currentPage: selected});
            }
          }/>
        </div>
      );
    } else if (this.state.currentPage === 'taskFolder') {
      return (
        <div>

        </div>
      )
    }
  }
}

export default App;
