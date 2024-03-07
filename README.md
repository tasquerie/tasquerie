# TASQUERIE

## Project Description
Tasquerie is a novel task management web app that provides to users all of the standard productivity app functions at their fingertips, with additional game-like features that make staying motivated and incentivised to complete their tasks.

The web app presents itself as a website interface that the user can log in to and see their collections of tasks, organised in a file-system-like way, such that each larger task can have several smaller tasks beneath it, which may also have smaller tasks too. Tasks can be customised with flexible descriptions that allow users to use markdown to add emphasis and links where needed. They can also use tags to quickly organise their tasks and filter them based on their needs. Tasquerie also allows for shared tasks - with shared tasks, users can keep each other accountable for completing parts of a larger task.

The game element is that every large task at the top level is associated with an egg, which the user can nurture and grow, and eventually hatch. Tasquerie offers a wide variety of eggs with various designs that require different amounts of effort; this, combined with the introduction of streaks and additional achievement rewards, incentivises users to keep on track and on time with the tasks they have set themselves. Users complete tasks to gain tokens, which they can use to purchase interactions or accessories for their creatures.

## Layout of directory structures
Our repository holds two folder for code: one for frontend (client), and one for backend (server). Here are the main directories:
- `client`
    - `src`: contains the source files for the frontend application
    - `public`: contains images
- `server`
    - `src`: contains the interface (types), api endpoints(server) and data models(model)
    - `test`: contains the test files
    - `firebase`: contains the database-related files

## Current State of Project
Unfortunately, due to difficulties with integration and finding time to implement everything, there is no possible use case that correctly integrates Frontend, Backend and the Database.

## Prerequisites Before Building Server
0. Open a terminal under the server directory (not root): i.e. `cd server`
1. Run `npm install` (at least once) to install node packages needed to build the server. You only need to do this once.
2. Run `npm install -g ts-node` to install ts-node
3. Run `npm install -g express`to install express
4. Run `npm install --save @types/express` for TS to understand express types

## How to Build the Server + Run Tests (Backend)
0. Open a terminal under the server directory (not root): i.e. `cd server`
1. Run `npm run build` to build the server in one step.
2. Run `npm test` to test the server in one step.

## How to Run the Server (Backend)
0. Build the server via instructions above
1. From the server directory run `npm start` to start the server

## React Server (Frontend) Setup
0. Open a terminal under the root directory. (You might need to `git checkout frontend` branch for most updated version).
1. Run `cd client`
1. Run `npm install` to make sure all packages are ready for frontend
3. Run `npm install font-awesome --save`
3. Run `npm run start:windows` to start server for windows and `npm run start:nix` to start server for Linux & Mac

## Testing - How to add a new test to the code base.

### Tutorial
See https://www.testim.io/blog/mocha-for-typescript-testing/ for a tutorial

### Naming
Test files should be named after the module they are testing, followed by '.spec.ts'
Ex: If we are writing tests for a module, 'User', then the test should be named 'User.spec.ts'

 ### Testing
By using assertions, each test can compare expected output to actual output.
Assertions can be imported via “  import { assert } from "chai";  “ and called via “  assert.equal(actual, expected);  “

See server\test\User.spec.ts for an example test