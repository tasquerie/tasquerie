// An area that displays the user’s collection of currently active Eggs. 
// If there are too many Eggs to display on the screen at once and fit within
// the area, users should be able to scroll. When the user clicks on an Egg, 
// they are taken to the egg view.
// Among this collection should also be an option to add a new Egg.
// Optionally, a user should be able to see any alerts (in the form of 
// notification icons) for certain eggs in this component.

import React, { Component } from 'react';
import { EggCard } from './EggCard';
import { AddEggCard } from './AddEggCard';
import { AddEggWindow } from './AddEggWindow';
import { BackendWrapper } from '../BackendWrapper';
import AuthContext from '../Context/AuthContext';
import Axios from 'axios';

interface EggCollectionProps {
  displayTaskFolder(folderName: string): void;
}

interface EggCollectionState {
  showingAddEggWindow: boolean;
  folders: any[];
}

class EggCollection extends Component<EggCollectionProps, EggCollectionState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: EggCollectionProps){
    super(props);
    this.state ={
      showingAddEggWindow: false,
      folders: []
    }
  }

  async componentDidMount() {
    // await this.loadTaskFolders();
    // await this.loadTaskFoldersConvoluted();
    await this.loadTaskFoldersTest();
  }

  async loadTaskFolders() {
    console.log('loading task folders');
    let args: Map<string, any> = new Map();
    args.set("UserID", this.context.getUser());

    try{
      let folders = await BackendWrapper.view("getAllTaskFolderInfo", args);
      // assumes this gets back a list of folder OBJECTS
      // if not - TODO: change this to a loop where each folderName then
      // gets getTaskFolderInfo'd
      if (folders === null) {
        throw Error("STOP");
      }
      this.setState({
        folders: folders
      })
      // console.log('loaded task folders');
    } catch (e) {
      console.log("Failure to load task folders");
    }
  }

  // backup for if the regular loadTaskFolders() doesn't work
  async loadTaskFoldersConvoluted() {
    console.log('loading task folders');
    let args: Map<string, any> = new Map();
    args.set("UserID", this.context.getUser());

    try{
      let user = await BackendWrapper.view("getUserInfo", args);
      // debug
      // console.log("debug task folder user: " + user)
      let folder;
      let folders = [];
      let folderNames:string[] = user.taskFolderKeys;
      // debug
      // console.log("debug task folder user After: " + JSON.stringify(folderNames));
      for (let folderName of folderNames) {
        // debug
        // console.log("debug task folder start: ")
        args.set("folderName", folderName);
        folder = await BackendWrapper.view("getTaskFolderInfo", args);
        // debug
        // console.log("debug task folder folder: " + folder)
        folders.push(folder);
      }
      // debug
      // console.log("debug task folder before set state: " + user)
      this.setState({
        folders: folders
      })
      // debug
      // console.log("debug task folder after set state: " + user)
    } catch (e) {
      console.log("Failure to load task folders");
    }
  }

  async loadTaskFoldersTest() {
    console.log('loading task folders');
    let response = await Axios.get(`https://us-central1-tasquerie-9e335.cloudfunctions.net/api/firebase/user/get?userID=${this.context.getUser()}`);
    let user = response.data;
    let taskFolders = user.taskFolders;
    let folders = [];
    for (let key in taskFolders) {
      folders.push(taskFolders[key]);
    }
    this.setState({
      folders: folders
    });
    console.log('loading task folders complete');
  }

  showAddEggWindow() {
    this.setState({showingAddEggWindow: true});
  }

  hideAddEggWindow() {
    this.setState({showingAddEggWindow: false});
  }

  forceReload() {
    this.forceUpdate();
  }

  render() {

    let eggs = [];
    for(let i = 0; i < this.state.folders.length; i++){
      eggs.push(
        <button className="invisibleButton" key={this.state.folders[i].name}
          onClick={() => this.props.displayTaskFolder(this.state.folders[i].name)}>
          <EggCard
            folder={this.state.folders[i]}
          />
        </button>
      );
    }

    let addEggWindow;
    if (this.state.showingAddEggWindow) {
      addEggWindow = <AddEggWindow
      forceReload={() => this.forceReload()}
      closeBox = {() => this.hideAddEggWindow()}
    />
    } else {
      addEggWindow = '';
    }

    return (
      <div id="egg-collection">
        {addEggWindow}
        {eggs}
        <button 
          onClick={() => this.showAddEggWindow()}
          className="invisibleButton" 
          key={'yahaha'}
          ><AddEggCard/></button>
      </div>
    );
  }
}

export default EggCollection;