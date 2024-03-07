
import React, {Component} from 'react';
import {AppState} from '../App';
import '../Components/EggCollection';

interface ArchiveProps {
    updateState(selected: string): void;
}

class Archive extends Component<ArchiveProps, AppState> {

    constructor(props: any){
        super(props);
        // no state
    }

    render() {

        const divStyle: React.CSSProperties = {
            position: 'absolute',
            top: '50%',
            left: '45%',
            // transform: 'translate(-50%, -50%)',
            // border: '1px solid black',
            padding: '20px',
            // backgroundColor: 'lightgray'
          };

        return (
            <div id="profile" style={divStyle}>
                <h1>Archive</h1>
                {/* <p>Yooo archive stuff here yay</p> */}
                <button onClick={() => this.props.updateState('home')}>Back to Home</button>
            </div>
        );
    }
}

export default Archive;