import React, { Component } from 'react';
import { Egg } from './Egg';

interface EggCardProps {
    folder: any; // TaskFolder object - might change to take folderName
                // in the future and then call some kind of loadEgg
                // but there's no point for repeated API calls...
}

interface EggCardState {

}

export class EggCard extends Component<EggCardProps, EggCardState> {
    constructor(props: EggCardProps) {
        super(props);
        // no state for now
    }

    render() {
        return(
            <div className="card">
                <div className="cardName">{this.props.folder.name}</div>
                <Egg 
                    folderName={this.props.folder.name}
                    egg={this.props.folder.egg}
                />
            </div>
        )
    }
}