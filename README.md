# TASQUERIE

## Project Description
Tasquerie is a novel task management web app that provides to users all of the standard productivity app functions at their fingertips, with additional game-like features that make staying motivated and incentivised to complete their tasks.

The web app presents itself as a website interface that the user can log in to and see their collections of tasks, organised in a file-system-like way, such that each larger task can have several smaller tasks beneath it, which may also have smaller tasks too. Tasks can be customised with flexible descriptions that allow users to use markdown to add emphasis and links where needed. They can also use tags to quickly organise their tasks and filter them based on their needs. Tasquerie also allows for shared tasks - with shared tasks, users can keep each other accountable for completing parts of a larger task.

The game element is that every large task at the top level is associated with an egg, which the user can nurture and grow, and eventually hatch. Tasquerie offers a wide variety of eggs with various designs that require different amounts of effort; this, combined with the introduction of streaks and additional achievement rewards, incentivises users to keep on track and on time with the tasks they have set themselves. Users complete tasks to gain tokens, which they can use to purchase interactions or accessories for their creatures.

## Github Layout Explanation
We've decided to use one repository holding two folders for code: one for frontend (client), and one for backend (server). There is a third folder that is supposed to hold shared data types that dictate the structure of API requests and responses so that these things are easily synchronised across frontend and backend.

## Server Setup
0. Open a terminal under this directory
1. Run `cd server`
2. Run `npm install` to install node packages needed to build the server
3. Run `npm install -g ts-node` to install ts-node
4. Run `npm install -g express`to install express
5. Run `npm install --save @types/express` for TS to understand express types
6. Run `ts-node index.ts` to start the server