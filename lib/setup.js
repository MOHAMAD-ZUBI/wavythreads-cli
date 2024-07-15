const fs = require("fs");
const { exec } = require("child_process");
const crypto = require("crypto");

function generateJwtSecret() {
  const jwtSecret = crypto.randomBytes(32).toString("hex");
  return jwtSecret;
}

function initProject(projectName) {
  console.log(`Initializing project ${projectName}...`);

  // Create src directory
  fs.mkdirSync(`${projectName}/src`, { recursive: true });

  // Create src subdirectories
  fs.mkdirSync(`${projectName}/src/controllers`, { recursive: true });
  fs.mkdirSync(`${projectName}/src/middlewares`, { recursive: true });
  fs.mkdirSync(`${projectName}/src/models`, { recursive: true });
  fs.mkdirSync(`${projectName}/src/routes`, { recursive: true });
  console.log(
    `Created Controllers, Middlewares, Models, Routes folders under src/`
  );

  // Generate JWT secret
  const jwtSecret = generateJwtSecret();
  console.log(`Generated random JWT-Secret`);

  // Create index.js inside src folder
  fs.writeFileSync(
    `${projectName}/src/index.js`,
    `
    const express = require('express');
    const mongoose = require('mongoose');
    const bcrypt = require('bcrypt');
    const dotenv = require('dotenv');
    const authRoutes = require('./routes/authRoutes');
    const nodemon = require('nodemon');

    dotenv.config();
    const app = express();
    const PORT = process.env.PORT || 3000;

    mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log('Connected to MongoDB');
    }).catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1); // Exit the process if MongoDB connection fails
    });

    app.use(express.json());

    app.use('/api/auth', authRoutes);

    app.listen(PORT, () => {
      console.log(\`Server running on port \${PORT}\`);
    });

   
  `
  );
  console.log(`Created index.js file`);

  // Create .env file in the root folder
  fs.writeFileSync(
    `${projectName}/.env`,
    `
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/${projectName}
    JWT_SECRET=${jwtSecret}
  `
  );
  console.log(`Created .env file`);

  // Create package.json inside project directory
  fs.writeFileSync(
    `${projectName}/package.json`,
    `
    {
      "name": "${projectName}",
      "version": "1.0.0",
      "scripts": {
        "start": "nodemon src/index.js"
      },
      "dependencies": {
       "bcrypt": "^5.1.1",
        "dotenv": "^16.4.5",
        "express": "^4.19.2",
        "jsonwebtoken": "^9.0.2",
        "mongoose": "^8.5.1",
        "nodemon": "^2.0.15"
      }
    }
  `
  );

  // Install required packages inside project directory
  exec(`cd ${projectName}/src && npm install`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error installing packages: ${err}`);
      return;
    }
    console.log(`Packages installed successfully.`);

    // Generate authentication files after packages are installed
    generateAuthFiles(projectName);
  });
}

function generateAuthFiles(projectName) {
  // Create authController.js
  fs.writeFileSync(
    `${projectName}/src/controllers/authController.js`,
    `
    const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const User = require('../models/authModel');

  // Register a new user
  async function register(req, res) {
    try {
      const { email, username, password } = req.body;

      // Check if user with the same email or username already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with the same email or username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({ email, username, password: hashedPassword });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return token and user object
      res.status(201).json({ token, user: { email: newUser.email, username: newUser.username } });
    } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
}

// Login a user
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return token and user object
    res.status(200).json({ token, user: { email: user.email, username: user.username } });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { register, login };
  `
  );

  // Create authMiddleware.js inside src/middlewares folder
  fs.writeFileSync(
    `${projectName}/src/middlewares/authMiddleware.js`,
    `
    // Example authentication middleware (you can customize this based on your needs)
    function authenticate(req, res, next) {
      // Add your authentication logic here
      next();
    }

    module.exports = authenticate;
  `
  );

  // Create authModel.js inside src/models folder
  fs.writeFileSync(
    `${projectName}/src/models/authModel.js`,
    `
    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      username: { type: String, required: true},
      password: { type: String, required: true },
    });

    const User = mongoose.model('User', userSchema);

    module.exports = User;
  `
  );

  // Create authRoutes.js inside src/routes folder
  fs.writeFileSync(
    `${projectName}/src/routes/authRoutes.js`,
    `
    const express = require('express');
    const { register, login } = require('../controllers/authController');
    const authenticate = require('../middlewares/authMiddleware');
    
    const router = express.Router();
    
    router.post('/register', register);
    router.post('/login', login);
    router.get('/users', authenticate, (req, res) => {
      res.send('List of users');
    });
    
    module.exports = router;
  `
  );

  console.log(`Authentication module generated successfully.`);
}

module.exports = { initProject, generateJwtSecret };
