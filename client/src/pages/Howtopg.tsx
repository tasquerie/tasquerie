import React, { Component } from 'react';
import { AppState } from '../App';
import '../Components/EggCollection';
import '../Components/Howto';
import Howto from '../Components/Howto';

export interface HowtoProps {
    updateState(selected: string): void;
}

class HowtoPg extends Component<HowtoProps> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
        <div>
            <h1 className='color-settings'>How To</h1>
            <Howto updateState={(selected: string) => {
            console.log(`switch page to ${selected}`);
            this.setState({ currentPage: selected });
            } } title={'Add Task'} description={'On the home page, click the box with the + and you will be prompted to enter a name and desciption. The task will be added with an egg and id assigned to your egg collection. '} />
            <Howto
            title={'Complete Tasks'} description={'To report progress on a tasl click the get associated with the task. You will then be prompted to click a box of completeion. Once completed, the completed egg will move to egg archive and you will recieve credits.'} updateState={function (selected: string): void {
              throw new Error('Function not implemented.');
            } } />
            <Howto
            title={'Local Credits'} description={'The form of currency used by Tasquerie. Credits can be used to interact with Eggs and unlock Accessories or even Eggs in the Egg Library. In most cases, Egg-Specific Credits are used to pay. If a user doesn’t have enough Egg-Specific Credits for an action but has an amount of Universal Credits that makes up for the difference between the Egg-Specific Credits required and the amount the user has, the action will go through, taking both Egg-Specific Credits and Universal Credits. Unlocks in the Egg Library require only Universal Credits. If a user attempts an action with insufficient Credits then the action does not go through.'} updateState={function (selected: string): void {
              throw new Error('Function not implemented.');
            } }          />
            <Howto
            title={'Universal Credits'} description={'Can be gained by completing miscellaneous tasks in the Task Basket, and as well as completing general achievements and streaks.'} updateState={function (selected: string): void {
              throw new Error('Function not implemented.');
            } } />
            <Howto
            title={'Egg-Spcific Credits'} description={'Can be gained by completing tasks within a task folder, and as well as completing general achievements and streaks. Egg-Specific Credits are specific to each Egg, meaning each Egg can have a different amount of Egg-Specific Credits. Even two instances of the same Egg Type can have a different amount.'} updateState={function (selected: string): void {
              throw new Error('Function not implemented.');
            } } />
            <button className='fa fa-angle-left' onClick={() => this.props.updateState('settings')}> Back to Settings</button>
        </div>
      );
    }
}

export default HowtoPg;