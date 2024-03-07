import React, { Component } from 'react';
import { Egg } from './Egg';

interface AddEggCardProps {
}

interface AddEggCardState {

}

export class AddEggCard extends Component<AddEggCardProps, AddEggCardState> {
    constructor(props: AddEggCardProps) {
        super(props);
        // no state for now
    }

    render() {
        return(
            <div className="card">
                <div id="addEgg">
                    +
                </div>
            </div>
        )
    }
}