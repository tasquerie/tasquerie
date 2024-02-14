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
      "https://media.discordapp.net/attachments/874365985002500126/1206833440511492096/egg1.png?ex=65dd723a&is=65cafd3a&hm=5a186ab84f24c59d4dba3dc11fd0543426aec4aada210b014874175902ef2172&=&format=webp&quality=lossless&width=192&height=192",
      "https://media.discordapp.net/attachments/874365985002500126/1206833440800903168/egg1-1.png?ex=65dd723a&is=65cafd3a&hm=76c091b3fa80ab77edf9b66c7304c30481d8dffbb44ef96edef237a62e9d9e54&=&format=webp&quality=lossless&width=192&height=192"
    ],
    stage: 0,
    activeAccessories: [],
    exp: 0,
    expBounds: [5, 15, 50]
  }
  
  let tempEgg2: EggType = {
    imgUrls: ["https://media.discordapp.net/attachments/874365985002500126/1206835872402509844/temp.png?ex=65dd747d&is=65caff7d&hm=8f742fda557eab2a77f092a56ad68174e62b778b54d0b25fc32064c92019437f&=&format=webp&quality=lossless&width=192&height=192"],
    stage: 0,
    activeAccessories: [],
    exp: 0,
    expBounds: [10000]
  }
  
  let tempEgg3: EggType = {
    imgUrls: [
      "https://media.discordapp.net/attachments/874365985002500126/1206835872666746910/temp2.png?ex=65dd747d&is=65caff7d&hm=f4332c795083058c0abe07ff3b8d20eec95c8c9da729d9c1c671132ef6fe225c&=&format=webp&quality=lossless&width=192&height=192"
    ],
    stage: 0,
    activeAccessories: [],
    exp: 0,
    expBounds: [10000]
  }
  
  let tempEgg4: EggType = {
    imgUrls: [
      "https://media.discordapp.net/attachments/874365985002500126/1206835872910155816/temp3.png?ex=65dd747e&is=65caff7e&hm=3de49c07a480cf53648718cea8fff1ceebc45c7f83c4575fdaebe7850be6c58b&=&format=webp&quality=lossless&width=192&height=192"
    ],
    stage: 0,
    activeAccessories: [],
    exp: 0,
    expBounds: [10000]
  }
  
  export let allEggs: any[] = [tempEgg1, tempEgg2, tempEgg3, tempEgg4]
  export let folderNames: string[] = ['CSE403', 'Other Class']
  export let eggCollection: any[] = [tempEgg1, tempEgg2]



///// TASK MOCKS /////
let task1: TaskType = {
    name: "Task 1",
    isComplete: false,
    description: "Yes this is indeed a task, could you believe that",
    creditReward: 5
}

let task2: TaskType = {
    name: "Task 2",
    isComplete: false,
    description: "Yep another task",
    creditReward: 5
}

let task3: TaskType = {
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