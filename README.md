
## WavyThreads CLI

WavyThreads CLI is a command-line tool designed to quickly scaffold and initialize backend projects with user authentication using Node.js, Express, MongoDB, bcrypt for password hashing, and JWT for authentication tokens.

### Installation

To use WavyThreads CLI, you need Node.js (which includes npm) installed on your machine. You can install the CLI globally using npm:

```bash
npm install -g wavythreads-cli

```

### Usage

# Initialize a New Project

To create a new project with WavyThreads CLI, run the following command:

```bash
wavythreads-cli init <project-name>
```

This command will set up a new project with the following structure:

    - src/Controllers: Controllers for handling business logic.
    - src/Middlewares: Middleware functions for request handling.
    - src/Models: MongoDB models for data schema.
    - src/Routes: Express routes for API endpoints.
    - src/index.js: Main application entry point.
    - .env: Environment configuration file with MongoDB connection URI, port, and JWT secret.

The project will also include the necessary dependencies in package.json and install them automatically using npm.

### Start the Project

Once initialized, you can start your project using nodemon for automatic server restarts:

```bash
npm start
```

This command will start the server defined in src/index.js and restart it whenever changes are made.

### Project Structure

The generated project will have the following structure:

```bash
<project-name>/
├── src/
│   ├── Controllers/
│   ├── Middlewares/
│   ├── Models/
│   ├── Routes/
│   └── index.js
├── .env
└── package.json
```

### Dependencies

    express: Fast, unopinionated, minimalist web framework for Node.js.
    mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
    bcrypt: Library for hashing passwords.
    dotenv: Loads environment variables from a .env file.
    nodemon: Utility for automatically restarting the server when files change.how to preview md file in vscodehow to preview md file in vscode
    jsonwebtoken: jwt authentication.

### Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on GitHub.
