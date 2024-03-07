
import React, {Component} from 'react';
// import {AppState} from '../App';
// import { Task, TaskType } from '../Components/Task'
// import * as mocks from '../Mocks';
// import { TaskList } from '../Components/TaskList'

// interface TaskFolderProps {
//     updateState(selected: string): void;
// }

// interface TaskFolderState {
//     addTaskWindowState: string // 'hidden' | 'shown'
// }

// class TaskFolder extends Component<TaskFolderProps, TaskFolderState> {

//     constructor(props: any){
//         super(props);
//         this.state = {
//             addTaskWindowState: 'hidden'
//         }
//     }

//     showAddTaskWindow() {
//         this.setState({
//             addTaskWindowState: 'shown'
//         });
//     }

//     hideAddTaskWindow() {
//         this.setState({
//             addTaskWindowState: 'hidden'
//         })
//     }

// //     updateCredits(newAmount: number) {
// //     }

//     addTask(task: TaskType) {
        
//     }

//     render() {
//         // let showingTab;
//         // if(this.state.eggFunctionTab === 'tasks'){
//         //     showingTab = <TaskList
//         //     updateCredits={(newAmount: number) => {this.updateCredits(newAmount)}}
//         //     eggId={this.props.eggId} />;
//         // }
//         // else if (this.state.eggFunctionTab === 'interactions') {
//         //     showingTab = <InteractionList
//         //     updateCredits={(newAmount: number) => {this.updateCredits(newAmount)}}
//         //     eggId={this.props.eggId} />;
//         // }
//         // else if (this.state.eggFunctionTab === 'accessories') {
//         //     showingTab = <div>Come Back Later</div>;
//         // }
//         return (
//             <div id="taskFolder">
//                 {/* TODO: EXP here needs to be engineered to show next threshold, or show
//                 nothing at all if the egg is already at the last stage */}
//                 <button className="invisibleButton" onClick={() => this.props.updateState('home')}>Back to Home</button>
//                 <div id="taskFolderTabs">
//                     <button className="invisibleButton taskFolderTabButton"
//                         onClick={() => this.setState({eggFunctionTab: 'tasks'})}
//                     >Tasks</button>
//                     <button className="invisibleButton taskFolderTabButton"
//                         onClick={() => this.setState({eggFunctionTab: 'interactions'})}
//                     // >Interact</button>
//                     <button className="invisibleButton taskFolderTabButton"
//                         onClick={() => this.setState({eggFunctionTab: 'accessories'})}
//                     >Accessorise</button>
//                 </div>
//                 {showingTab}
//             </div>
//         );
//     }
// }

// export default TaskFolder;