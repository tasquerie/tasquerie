import React, { Component } from 'react';
import * as mocks from '../Mocks'
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';

// hard-coded list of egg types
let eggTypes: string[] = [];

interface AddEggWindowProps {
    forceReload(): void;
    closeBox(): void;
}

interface AddEggWindowState {
    selectedEgg: number;
    folderName: string;
    eggImages: string[];
}

export class AddEggWindow extends Component<AddEggWindowProps, AddEggWindowState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: AddEggWindowProps) {
        super(props);
        this.state = {
            selectedEgg: 0, // 0 for default choosing first egg, -1 for no egg but
                            // then some error handling needs to be done
            folderName: '',
            eggImages: []
        }
    }

    async componentDidMount() {
        await this.loadEggImages();
    }

    async loadEggImages() {
        console.log("loading egg images");
        let args: Map<string, any> = new Map();
        
        try{
            let eggType;
            let eggImgUrls = [];
            for (let i = 0; i < eggTypes.length; i++) {
                args.set("name", eggTypes[i]);
                eggType = await BackendWrapper.view("getEggType", args);
                eggImgUrls.push(eggType.graphicLinks[0]);
            }
            this.setState({
                eggImages: eggImgUrls
            })
        } catch (e) {
            console.log("Failure to get egg images");
        }
    }

    async addEgg(eggType: string) {
        if (eggType === undefined) {
            eggType = '';
        }

        let args: Map<string, any> = new Map();
        args.set("UserID", {id: this.context.getUser()});
        args.set("name", this.state.folderName);
        args.set("description", "TEMPORARY DESCRIPTION");
        args.set("eggType", eggType);

        try {
            await BackendWrapper.controller("addFolder", args);
            this.props.forceReload();
        } catch (e) {
            console.log("Failure to add new task folder");
        }
    }

    render() {
        let eggs = [];
        let highlightState; // 'selectedEgg' | ''
        let eggImgUrl;
        for(let i = 0; i < this.state.eggImages.length; i++){
            eggImgUrl = 'url(' + this.state.eggImages[i] + ')';
            if (this.state.selectedEgg == i) {
                highlightState = 'selectedEgg';
            } else {
                highlightState = '';
            }
            eggs.push(
                <button
                    className={"eggOption " + highlightState}
                    onClick={() => this.setState({selectedEgg: i})}
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
            <div id="addEggWindow">
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
                        this.addEgg(eggTypes[this.state.selectedEgg]);
                        this.setState({selectedEgg: -1, folderName: "Egg Name"});
                        this.props.closeBox();
                    }}
                >Confirm</button>
            </div>
        )
    }
}