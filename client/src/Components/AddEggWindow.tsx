import React, { Component } from 'react';
import { Task, TaskType } from './Task';
import { Egg, EggType } from './Egg';
import * as mocks from '../Mocks'

interface AddEggWindowProps {
    closeBox(): void;
    visible: string;
}

interface AddEggWindowState {
    selectedEggId: number;
    folderName: string;
}

/** 
 * TODO: fix this whole gosh darn thing
 * rn the copy stuff doesn't really work when creating a new egg
 * so. fix that
 */

export class AddEggWindow extends Component<AddEggWindowProps, AddEggWindowState> {
    constructor(props: AddEggWindowProps) {
        super(props);
        this.state = {
            selectedEggId: 0,
            folderName: ''
        }
    }

    addEgg(eggType: number) {
        mocks.folderNames.push(this.state.folderName);
        let newEgg: EggType = {...mocks.allEggs[eggType]};
        mocks.eggCollection.push(newEgg);
        mocks.tasksList.push([]);
        mocks.interactionsList.push([]);
        mocks.specificCredits.push(0);
    }

    render() {
        let eggs = [];
        let highlightState; // 'selectedEgg' | ''
        let eggImgUrl;
        for(let i = 0; i < mocks.allEggs.length; i++){
            eggImgUrl = 'url(' + mocks.allEggs[i].imgUrls[0] + ')';
            if (this.state.selectedEggId == i) {
                highlightState = 'selectedEgg';
            } else {
                highlightState = '';
            }
            eggs.push(
                <button
                    className={"eggOption " + highlightState}
                    onClick={() => this.setState({selectedEggId: i})}
                >
                    <div
                        style={
                            {
                                backgroundImage: eggImgUrl,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                height: '100px',
                                width: '100px'
                            }
                        }
                    >
                    </div>
                </button>
            );
        }
        return(
            <div id="addEggWindow" className={this.props.visible}>
                <button onClick={() => {
                    this.props.closeBox();
                }}>
                    X / Cancel
                </button>
                <div>Add New Egg</div>
                <textarea
                    onChange={(event) => {
                        this.setState({
                            folderName: event.target.value
                        });
                    }}
                    id="addFolderName"
                    placeholder="Egg Name"
                ></textarea>
                <div id="eggSelectionContainer">
                    {eggs}
                </div>
                <button
                    onClick={() => {
                        this.addEgg(this.state.selectedEggId);
                        this.setState({selectedEggId: -1, folderName: "Egg Name"});
                        this.props.closeBox();
                    }}
                >Confirm</button>
            </div>
        )
    }
}