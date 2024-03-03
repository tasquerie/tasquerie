import { TaskType } from './Components/Task'
import { EggType } from './Components/Egg'
import { InteractionType } from './Components/Interaction'

///// CREDITS MOCKS /////
export let universalCredits: number = 0;
export let specificCredits: number[] = [
    25,
    0
];


///// EGG MOCKS /////
let tempEgg1: EggType = {
    imgUrls: [
      "https://media.discordapp.net/attachments/874365985002500126/1206833440511492096/egg1.png?ex=65efe73a&is=65dd723a&hm=31075d395483aa7f0ba5eecb10d2a6c0ba5204e0e66925110a9abeaaefd33c2f&=&format=webp&quality=lossless&width=160&height=160",
      "https://media.discordapp.net/attachments/874365985002500126/1206833440800903168/egg1-1.png?ex=65efe73a&is=65dd723a&hm=c83182ad1325e23ee0cdffac2d7223bda5898ae706e0365edca77950bd6d8c7d&=&format=webp&quality=lossless&width=160&height=160"
    ],
    stage: 0,
    activeAccessories: [],
    exp: 0,
    expBounds: [10, 50, 100]
  }
  
  let tempEgg2: EggType = {
    imgUrls: ["https://cdn.discordapp.com/attachments/874365985002500126/1207412448462905344/temp.png?ex=65f20278&is=65df8d78&hm=8df5b4e6601a13e79c0651e9d22051c2128255409bcc7270cea4c7c572b360d1&"],
    stage: 0,
    activeAccessories: [],
    exp: 0,
    expBounds: [10000]
  }
  
  let tempEgg3: EggType = {
    imgUrls: [
      "https://media.discordapp.net/attachments/874365985002500126/1207412448722686027/temp2.png?ex=65df8d78&is=65cd1878&hm=179b01d5467114682bb85faae94ab00d29c4223c2508965d962d26a7129cd339&=&format=webp&quality=lossless&width=192&height=192"
    ],
    stage: 0,
    activeAccessories: [],
    exp: 0,
    expBounds: [10000]
  }
  
  let tempEgg4: EggType = {
    imgUrls: [
      "https://media.discordapp.net/attachments/874365985002500126/1207412449129660508/temp3.png?ex=65df8d78&is=65cd1878&hm=ece449b6c3271e903afd78c15e38af5753a878bcae32c5dd99b3d1cf8ffb8352&=&format=webp&quality=lossless&width=192&height=192"
    ],
    stage: 0,
    activeAccessories: [],
    exp: 0,
    expBounds: [10000]
  }
  
  export let allEggs: any[] = [tempEgg1, tempEgg2, tempEgg3, tempEgg4]
  export let folderNames: string[] = ['CSE403', 'Other Class']
  export let eggCollection: any[] = [{...tempEgg1}, {...tempEgg2}]



///// TASK MOCKS /////
let task1: TaskType = {
    uid: 'ahahaha',
    name: "Task 1",
    isComplete: false,
    description: "Yes this is indeed a task, could you believe that",
    creditReward: 5
}

let task2: TaskType = {
    uid: 'nahhh',
    name: "Task 2",
    isComplete: false,
    description: "Yep another task",
    creditReward: 5
}

let task3: TaskType = {
    uid: 'help',
    name: "Task 3",
    isComplete: false,
    description: "Whoa would you believe it, another task",
    creditReward: 5
}

// list of lists of tasks - index is egg ID
// extremely scuffed, but mock will mock
export let tasksList = [
    [task1, task2],
    [task3]
]


///// INTERACTION MOCKS /////
let interaction1: InteractionType = {
    name: "pet",
    cost: 5,
    rewardExp: 5
}

let interaction2: InteractionType = {
    name: "windsurf",
    cost: 20,
    rewardExp: 25
}

let interaction3: InteractionType = {
    name: "skydive",
    cost: 100,
    rewardExp: 150
}

let interaction4: InteractionType = {
    name: "you thought",
    cost: 0,
    rewardExp: 0
}

export let interactionsList = [
    [interaction1, interaction2, interaction3],
    [interaction4]
]