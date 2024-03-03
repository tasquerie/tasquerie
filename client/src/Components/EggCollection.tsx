// An area that displays the user’s collection of currently active Eggs. 
// If there are too many Eggs to display on the screen at once and fit within
// the area, users should be able to scroll. When the user clicks on an Egg, 
// they are taken to the egg view.
// Among this collection should also be an option to add a new Egg.
// Optionally, a user should be able to see any alerts (in the form of 
// notification icons) for certain eggs in this component.

import React, { Component } from 'react';
import { Egg, EggType } from './Egg';
import { EggCard } from './EggCard';
import { AddEggCard } from './AddEggCard';
import { eggCollection, folderNames } from '../Mocks';
import { AddEggWindow } from './AddEggWindow';
import { BackendWrapper } from '../BackendWrapper';
import AuthContext from '../Context/AuthContext';

interface EggCollectionProps {
  displayTaskFolder(eggId: number): void;
}

interface EggCollectionState {
  addEggState: string; // 'hidden' | 'shown'
  eggs: EggType[];
}

class EggCollection extends Component<EggCollectionProps, EggCollectionState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: EggCollectionProps){
    super(props);
    this.state ={
      addEggState: 'hidden',
      eggs: []
    }
  }

  async componentDidMount() {
      console.log('EggCollection componentdidmount');
      // await this.getEggs();
  }

  showAddEggWindow() {
    this.setState({addEggState: 'shown'})
  }

  hideAddEggWindow() {
    this.setState({addEggState: 'hidden'})
  }

  /**
   * Gets all eggs from backend API
   */
  async getEggs() {
    let args: Map<string, any> = new Map();
    args.set("UserID", this.context.getUser());
    let user = await BackendWrapper.view("getUserInfo", args);
    // user should not be empty string
    let eggList: EggType[] = [];
    this.setState({
      eggs: eggList
    })
  }

  render() {
    // refactor to use this.state.eggs later
    let eggs = [];
    for(let i = 0; i < eggCollection.length; i++){
      eggs.push(<button className="invisibleButton" id={folderNames[i]}
      onClick={() => this.props.displayTaskFolder(i)}>
        <EggCard
        cardName={folderNames[i]}
        egg={eggCollection[i]}
        />
      </button>)
    }

    let addEggWindow;
    if (this.state.addEggState == 'shown') {
      addEggWindow = <AddEggWindow
      closeBox = {() => this.hideAddEggWindow()}
      visible = {this.state.addEggState}
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
          id={'yahaha'}
          ><AddEggCard/></button>
      </div>
    );
  }
}

export default EggCollection;