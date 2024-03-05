<!-- TODO: erase block codes-->
## How to obtain the source code. 

>If your system uses multiple repositories or submodules, provide clear instructions for how to obtain all relevant sources.

Tasquerie's source code is organized within a single GitHub repository, containing separate folders for the frontend and backend. 

Start by cloning the repository to your local machine using Git through the following:

`git clone https://github.com/tasquerie/tasquerie.git`

## Layout of directory structures

>The layout of your directory structure. What do the various directories (folders) contain, and where to find source files, tests, documentation, data files, etc.

Our repository holds two folder for code: one for frontend (client), and one for backend (server).
- `client`
    - `src`: contains the source files for the frontend application
    - `public`: contains images
- `server`
    - `src`: contains the interface (types), api endpoints(server) and data models(model)
    - `test`: contains the test files
    - `firebase`: contains the database-related files

> CHECK: Are we going to delete the shared folder? 
>>There is a third folder that is supposed to hold shared data types that dictate the structure of API requests and responses so that these things are easily synchronised across frontend and backend.

## How to build the software.

> Provide clear instructions for how to use your project’s build system to build all system components.


### Prerequisites Before Building Server
0. Open a terminal under the server directory (not root): i.e. `cd server`
1. Run `npm install` (at least once) to install node packages needed to build the server. You only need to do this once.
2. Run `npm install -g ts-node` to install ts-node
3. Run `npm install -g express`to install express
4. Run `npm install --save @types/express` for TS to understand express types

### How to Build the Server + Run Tests (Backend)
0. Open a terminal under the server directory (not root): i.e. `cd server`
1. Run `npm run build` to build the server in one step.
2. Run `npm test` to test the server in one step.

### How to Run the Server (Backend)
0. Build the server via instructions above
1. From the server directory run `ts-node src/server/index.ts` to start the server

### React Server (Frontend) Setup
0. Open a terminal under the root directory. (You might need to `git checkout frontend` branch for most updated version).
1. Run `cd client`
1. Run `npm install` to make sure all packages are ready for frontend
3. Run `npm install font-awesome --save`
3. Run `npm run start:windows` to start server for windows and `npm run start:nix` to start server for Linux & Mac

## How to test the software. Provide clear instructions for how to run the system’s test cases. In some cases, the instructions may need to include information such as how to access data sources or how to interact with external systems. You may reference the user documentation (e.g., prerequisites) to avoid duplication.

## How to add new tests. Are there any naming conventions/patterns to follow when naming test files? Is there a particular test harness to use?

### Tutorial
See https://www.testim.io/blog/mocha-for-typescript-testing/ for a tutorial

### Naming
Test files should be named after the module they are testing, followed by '.spec.ts'
Ex: If we are writing tests for a module, 'User', then the test should be named 'User.spec.ts'

 ### Testing
By using assertions, each test can compare expected output to actual output.
Assertions can be imported via “  import { assert } from "chai";  “ and called via “  assert.equal(actual, expected);  “

See server\test\User.spec.ts for an example test

## How to build a release of the software. Describe any tasks that are not automated. For example, should a developer update a version number (in code and documentation) prior to invoking the build system? Are there any sanity checks a developer should perform after building a release?