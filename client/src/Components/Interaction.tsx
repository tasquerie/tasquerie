import React, { Component } from 'react';
import AuthContext from '../Context/AuthContext';
import { BackendWrapper } from '../BackendWrapper';

// NOTE: egg image sizes are strictly 256x256. Otherwise things break

interface InteractionProps {
    folderName: string;
    interactionName: string;
    showAlert(): void;
    refreshFolder(): void;
}

interface InteractionState {
    name: string;
    cost: number;
    expGained: number;
}

export class Interaction extends Component<InteractionProps, InteractionState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: any){
        super(props);
        this.state = {
            name: 'Placeholder Interaction',
            cost: 0,
            expGained: 0
        }
    }

    async componentDidMount() {
        await this.loadInteractionInfo();
    }

    async loadInteractionInfo() {
        let args: Map<string, any> = new Map();
        args.set("name", this.props.interactionName);
        try {
            let interaction = await BackendWrapper.view("getInteraction", args);
            this.setState({
                name: interaction.name,
                cost: interaction.cost,
                expGained: interaction.expGained
            })
        } catch (e) {
            console.log("Failure to load interaction");
        }
    }

    async applyInteraction() {
        let args: Map<string, any> = new Map();
        args.set("UserID", this.context.getUser());
        args.set("folderName", this.props.folderName);
        args.set("interactionType", this.state.name);

        try {
            let paySuccess: boolean = await BackendWrapper.controller("buyInteraction", args);
            if (!paySuccess) {
                this.props.showAlert();
            }
        } catch (e) {
            console.log("Failure to interact with egg");
            // could be either folder doesn't exist, or illegal interaction
            // which should not happen
            // leaving last option - network problem
        }

        this.props.refreshFolder();
    }

    render() {
        return(
            <button className="interaction" style={{position: 'relative'}}
                onClick={async () => {
                    this.applyInteraction();
                }}
            >
                <div className="interactionName">{this.state.name}</div>
                <div className="interactionInfo">
                    <div>Cost: {this.state.cost}</div>
                    <div>+ {this.state.expGained} EXP</div>
                </div>
            </button>
        )
    }
}