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
import { eggCollection, folderNames } from '../App';

interface Task {
  id: number;
  title: string;
  photoUrl: string;
}

interface EggCollectionProps {
  displayTaskFolder(eggId: number): void;
  eggs: EggType[];
}

class EggCollection extends Component<EggCollectionProps> {

  constructor(props: EggCollectionProps){
    super(props);
    // no state for now
  }

  render() {
    let eggs = [];
    for(let i = 0; i < eggCollection.length; i++){
      eggs.push(<button className="invisibleButton" id={folderNames[i]}>
        <EggCard
        cardName={folderNames[i]}
        egg={eggCollection[i]}
        />
      </button>)
    }

    return (
      <div id="egg-collection">
        {eggs}
        <button className="invisibleButton" id={'yahaha'}><AddEggCard/></button>
      </div>
    );
  }
}

export default EggCollection;