
import React, {Component} from 'react';
import { TaskType } from '../Components/Task'
import * as mocks from '../Mocks';
import { TaskList } from '../Components/TaskList'
import { Egg } from '../Components/Egg'
import { InteractionList } from '../Components/InteractionList'
import { Interaction } from '../Components/Interaction';
import AuthContext from '../Context/AuthContext';

interface TaskFolderProps {
    folderName: string;
    updateState(selected: string): void;
    eggId: number;
}

interface TaskFolderState {
    folderName: string;
    egg: any // Egg object in backend
    eggFunctionTab: string // 'tasks' | 'interactions' | 'accessories'
    eggCredits: number
}

class TaskFolder extends Component<TaskFolderProps, TaskFolderState> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: any){
        super(props);
        this.state = {
            folderName: "yee",
            egg: null,
            eggFunctionTab: 'tasks',
            eggCredits: mocks.specificCredits[this.props.eggId]
        }
    }

    toggleCompletion(taskId: number, rewardCredits: number) {
        mocks.tasksList[this.props.eggId][taskId].isComplete = !(mocks.tasksList[this.props.eggId][taskId].isComplete);
        mocks.specificCredits[this.props.eggId] += rewardCredits;
        this.setState({eggCredits: mocks.specificCredits[this.props.eggId]});
        // mocks.tasksList[this.props.eggId][taskId].isComplete = true;
    }

    updateCredits(newAmount: number) {
        this.setState({
            eggCredits: newAmount
        });
    }

    addTask(task: TaskType) {
        mocks.tasksList[this.props.eggId].push(task);
    }

    render() {
        let showingTab;
        if(this.state.eggFunctionTab === 'tasks'){
            showingTab = <TaskList
                folderName={this.props.folderName}
            />;
        }
        else if (this.state.eggFunctionTab === 'interactions') {
            showingTab = <InteractionList
            updateCredits={(newAmount: number) => {this.updateCredits(newAmount)}}
            eggId={this.props.eggId} />;
        }
        else if (this.state.eggFunctionTab === 'accessories') {
            showingTab = <div>Come Back Later</div>;
        }
        return (
            // TODO: somehow get taskfolder & taskfolder name - as of now there is no way for
            // a taskfolder to be uniquely identified, which is concerning
            <div id="taskFolder">
                <h1>Task Folder: EGG {this.props.eggId}</h1>
                <p>You have: <span>{mocks.specificCredits[this.props.eggId]}</span> credits for this egg</p>
                <Egg
                    egg={mocks.eggCollection[this.props.eggId]}
                />
                <div id="eggExp">EXP: {mocks.eggCollection[this.props.eggId].exp}/{mocks.eggCollection[this.props.eggId].expBounds[mocks.eggCollection[this.props.eggId].stage]}</div>
                {/* TODO: EXP here needs to be engineered to show next threshold, or show
                nothing at all if the egg is already at the last stage */}
                <button className="invisibleButton" onClick={() => this.props.updateState('home')}>Back to Home</button>
                <div id="taskFolderTabs">
                    <button className="invisibleButton taskFolderTabButton"
                        onClick={() => this.setState({eggFunctionTab: 'tasks'})}
                    >Tasks</button>
                    <button className="invisibleButton taskFolderTabButton"
                        onClick={() => this.setState({eggFunctionTab: 'interactions'})}
                    >Interact</button>
                    <button className="invisibleButton taskFolderTabButton"
                        onClick={() => this.setState({eggFunctionTab: 'accessories'})}
                    >Accessorise</button>
                </div>
                {showingTab}
            </div>
        );
    }
}

export default TaskFolder;